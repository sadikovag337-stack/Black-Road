module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const BOT = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT = process.env.TELEGRAM_CHAT_ID;
  if (!BOT || !CHAT) {
    return res.status(500).json({ ok: false, error: 'Telegram bot token or chat id not configured' });
  }

  const body = req.body || {};
  const { name, contact, service, subservices, area, total, message } = body;
  const time = new Date().toLocaleString();

  let text = `📩 *Новая заявка с сайта Black Road*\n`;
  if (service) text += `\n*Услуга:* ${service}`;
  if (subservices) text += `\n*Подуслуги:* ${subservices}`;
  if (area) text += `\n*Площадь:* ${area} м²`;
  if (total) text += `\n*Итого:* ${total}`;
  if (name) text += `\n*Имя:* ${name}`;
  if (contact) text += `\n*Контакт:* ${contact}`;
  if (message) text += `\n*Сообщение:* ${message}`;
  text += `\n\n_Время:_ ${time}`;

  try {
    const resp = await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT, text, parse_mode: 'Markdown' })
    });
    const data = await resp.json();
    if (!data || !data.ok) throw new Error(data && data.description ? data.description : 'Telegram API error');
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
