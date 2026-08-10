export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      ok: false, 
      error: 'Method Not Allowed. Используйте POST.' 
    });
  }

  // Токен и чат ID из переменных окружения Vercel
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Проверка: есть ли токен и чат
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('❌ Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
    return res.status(500).json({ 
      ok: false, 
      error: 'Телеграм бот не настроен. Добавьте переменные окружения.' 
    });
  }

  try {
    const { name, contact, service, subservices, area, total, message } = req.body || {};

    // Формируем текст сообщения
    const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });
    
    let text = '📩 *Новая заявка с сайта Black Road*\n\n';
    if (service) text += `📌 *Услуга:* ${service}\n`;
    if (subservices) text += `🔧 *Подуслуги:* ${subservices}\n`;
    if (area) text += `📐 *Площадь:* ${area} м²\n`;
    if (total) text += `💰 *Итого:* ${total}\n`;
    if (name) text += `👤 *Имя:* ${name}\n`;
    if (contact) text += `📱 *Телефон:* ${contact}\n`;
    if (message && message !== 'Без дополнительной информации') {
      text += `📝 *Сообщение:* ${message}\n`;
    }
    text += `\n🕐 *Время:* ${time}`;

    // Отправляем в Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('❌ Telegram API ошибка:', data);
      throw new Error(data.description || 'Ошибка отправки в Telegram');
    }

    console.log('✅ Заявка отправлена в Telegram');
    return res.status(200).json({ 
      ok: true, 
      message: 'Заявка успешно отправлена!' 
    });

  } catch (error) {
    console.error('❌ Ошибка:', error);
    return res.status(500).json({ 
      ok: false, 
      error: error.message || 'Внутренняя ошибка сервера' 
    });
  }
}