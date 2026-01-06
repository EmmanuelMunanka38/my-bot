require('dotenv').config();
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const express = require('express');
const { Server } = require('socket.io');
const { HfInference } = require('@huggingface/inference');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const hf = new HfInference(process.env.HF_TOKEN);

app.use(express.static(path.join(__dirname, 'public')));

let activeSessions = new Map();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    console.log("✅ MongoDB Connected");

    io.on('connection', (socket) => {
        socket.on('start-session', async (userId) => {
            // 1. SANITIZE ID (Fixes the "Invalid clientId" error)
            const safeId = userId.replace(/[^a-zA-Z0-9-_]/g, '_');

            if (activeSessions.has(safeId)) {
                return socket.emit('status', 'Bot is already active.');
            }

            const client = new Client({
                authStrategy: new RemoteAuth({
                    clientId: safeId,
                    store: store,
                    backupSyncIntervalMs: 60000
                }),
                puppeteer: { 
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
                }
            });

            client.on('qr', (qr) => socket.emit('qr', qr));

            client.on('ready', () => {
                activeSessions.set(safeId, client);
                socket.emit('status', 'Bot Connected!');
                console.log(`User ${safeId} is online`);
            });

            // 2. COMBINED CORE LOGIC (Fixes the "Not Responding" error)
            client.on('message_create', async (msg) => {
                // Feature: Auto-View Status
                if (msg.isStatus || msg.type === 'status_v3') {
                    try {
                        const chat = await msg.getChat();
                        await chat.sendSeen();
                    } catch (e) {}
                }

                // Feature: Get Group ID
                if (msg.body === '!id') {
                    await msg.reply(`Chat ID: ${msg.from}`);
                }

                // Feature: AI Rewrite
                if (msg.body.startsWith('!rewrite ')) {
                    const text = msg.body.replace('!rewrite ', '').trim();
                    try {
                        const chat = await msg.getChat();
                        await chat.sendStateTyping();
                        const result = await hf.textGeneration({
                            model: 'Ateeqq/Text-Rewriter-Paraphraser',
                            inputs: `paraphrase: ${text}`,
                            parameters: { max_new_tokens: 150 }
                        });
                        await msg.reply(result.generated_text || "AI Error");
                    } catch (err) {
                        await msg.reply("⚠️ AI is busy.");
                    }
                }
            });

            client.initialize();
        });

        // Member Extractor Logic
        socket.on('extract-members', async ({ userId, groupId }) => {
            const safeId = userId.replace(/[^a-zA-Z0-9-_]/g, '_');
            const client = activeSessions.get(safeId);
            if (!client) return socket.emit('status', 'Connect WhatsApp first.');

            try {
                const chat = await client.getChatById(groupId);
                if (chat.isGroup) {
                    let csv = "Name,Number,Admin\n";
                    for (const p of chat.participants) {
                        const contact = await client.getContactById(p.id._serialized);
                        const name = (contact.pushname || "Unknown").replace(/,/g, "");
                        csv += `"${name}","${p.id.user}","${p.isAdmin}"\n`;
                    }
                    socket.emit('download-csv', { groupName: chat.name, data: csv });
                }
            } catch (err) {
                socket.emit('status', 'Extraction Failed.');
            }
        });
    });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));