import yts from 'yt-search'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper-sosmed'

let handler = async (m, { conn, command, text }) => {
    if (!text) throw `مثال :\n*.play* sami yusuf`
    let loadd = [
 '《██▒▒▒▒▒▒▒▒▒▒▒》10%',
 '《████▒▒▒▒▒▒▒▒▒》30%',
 '《███████▒▒▒▒▒▒》50%',
 '《██████████▒▒▒》70%',
 '《█████████████》100%',
 '> *_☯️ تم التحويل ✅ بنجاح ..._*'
 ]

let { key } = await conn.sendMessage(m.chat, {text: '_Loading_'})//Pengalih isu

for (let i = 0; i < loadd.length; i++) {
await conn.sendMessage(m.chat, {text: loadd[i], edit: key })}
    let res = await yts(text)
    let vid = res.videos[0]
    
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })
    
    if (!vid) throw 'لم يتم العثور عليه، حاول عكس العنوان والمؤلف'
    
    const url = 'https://www.youtube.com/watch?v=' + vid.videoId
    
    // تنزيل الصوت فقط
    const yt = await youtubedl(url).catch(async () => await youtubedlv2(url))
    const link = await yt.audio['128kbps'].download()
    
    // إعداد الرسالة لإرسال الملف الصوتي فقط
    let doc = { 
        audio: { 
            url: link 
        }, 
        mimetype: 'audio/mp4', 
        fileName: `${vid.title}.mp4` // إضافة لاحقة mp4 لاسم الملف
    }
    
    return conn.sendMessage(m.chat, doc, { quoted: m })
}

handler.help = ['song', 'play']
handler.tags = ['downloader']
handler.command = /^s/i

export default handler

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())]
}