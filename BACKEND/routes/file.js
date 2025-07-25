const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const File = require('../models/File');
const User = require('../models/User');
const router = express.Router();

// Use multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Helper to get GridFSBucket
function getGridFSBucket() {
    return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
}

// Middleware to verify JWT and set req.userId
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.userId = decoded.id;
        next();
    });
}

// POST /api/upload - upload a file to GridFS using native driver
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const bucket = getGridFSBucket();
        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype
        });
        uploadStream.end(req.file.buffer);
        uploadStream.on('finish', async () => {
            const fileId = uploadStream.id;
            const file = new File({
                name: req.file.originalname,
                url: `/api/file/${fileId}`,
                gridfsId: fileId.toString(),
                user: user._id,
                uploadedAt: new Date()
            });
            await file.save();
            res.json({ message: 'File uploaded!', file });
        });
        uploadStream.on('error', (err) => {
            res.status(500).json({ message: 'Upload failed', error: err.message });
        });
    } catch (err) {
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
});

// GET /api/myfiles - get files for logged-in user
router.get('/myfiles', authMiddleware, async (req, res) => {
    try {
        const files = await File.find({ user: req.userId }).sort({ uploadedAt: -1 });
        res.json(files.map(f => ({ name: f.name, url: f.url, id: f._id })));
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch files', error: err.message });
    }
});

// GET /api/explore?search=... - search all files
router.get('/explore', authMiddleware, async (req, res) => {
    const search = req.query.search || '';
    try {
        const files = await File.find({
            name: { $regex: search, $options: 'i' }
        }).populate('user', 'username email');
        res.json(files.map(f => ({
            name: f.name,
            url: f.url,
            user: f.user.username || f.user.email,
            id: f._id
        })));
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch files', error: err.message });
    }
});

// DELETE /api/file/:id - delete user's file from GridFS and DB
router.delete('/file/:id', authMiddleware, async (req, res) => {
    try {
        const fileDoc = await File.findById(req.params.id);
        if (!fileDoc) {
            console.log('File not found in File collection:', req.params.id);
            return res.status(404).json({ message: 'File not found' });
        }
        if (fileDoc.user.toString() !== req.userId) {
            console.log('Unauthorized delete attempt by user', req.userId, 'for file', req.params.id);
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const bucket = getGridFSBucket();
        let gridfsDeleted = false;
        if (!fileDoc.gridfsId || fileDoc.gridfsId === 'undefined') {
            console.log('File has no valid gridfsId, cleaning up metadata only:', req.params.id);
        } else {
            try {
                const fileId = new ObjectId(fileDoc.gridfsId);
                await bucket.delete(fileId);
                console.log('Deleted from GridFS:', fileId);
                gridfsDeleted = true;
            } catch (gfsErr) {
                // If file not found in GridFS, treat as already deleted
                if (gfsErr.message && gfsErr.message.match(/FileNotFound/)) {
                    console.log('GridFS file already deleted or missing:', fileDoc.gridfsId);
                } else {
                    console.log('GridFS delete error:', gfsErr.message);
                    return res.status(500).json({ message: 'GridFS delete failed', error: gfsErr.message });
                }
            }
        }
        // Delete metadata
        try {
            await File.findByIdAndDelete(req.params.id);
            console.log('Deleted from File collection:', req.params.id);
        } catch (metaErr) {
            console.log('MongoDB File collection delete error:', metaErr.message);
            return res.status(500).json({ message: 'Metadata delete failed', error: metaErr.message });
        }
        let msg = 'File metadata deleted';
        if (gridfsDeleted) msg = 'File deleted from storage and database';
        res.json({ message: msg });
    } catch (err) {
        console.log('Delete failed:', err.message);
        res.status(500).json({ message: 'Delete failed', error: err.message });
    }
});

// GET /api/file/:id - download file from GridFS using native driver
router.get('/file/:id', authMiddleware, async (req, res) => {
    try {
        const fileDoc = await File.findById(req.params.id);
        if (!fileDoc) return res.status(404).json({ message: 'File not found' });
        const bucket = getGridFSBucket();
        const fileId = new ObjectId(fileDoc.gridfsId);
        // Get file info for headers
        const files = await bucket.find({ _id: fileId }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No file exists' });
        }
        const file = files[0];
        res.set('Content-Type', file.contentType || 'application/octet-stream');
        res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');
        const downloadStream = bucket.openDownloadStream(fileId);
        downloadStream.on('error', () => res.status(404).json({ message: 'No file exists' }));
        downloadStream.pipe(res);
    } catch (err) {
        res.status(500).json({ message: 'Download failed', error: err.message });
    }
});

module.exports = router;
