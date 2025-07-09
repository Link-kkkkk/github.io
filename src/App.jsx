import { useState, useRef, useEffect } from 'react';
import './App.css';

const QUICK_WORDS = [
  '你好',
  '你是谁？',
  '帮我写一段代码',
  '今天天气怎么样？',
  '讲个笑话',
];

function mockAIReply(userMsg) {
  // 简单 mock，实际可接入 API
  if (userMsg.includes('天气')) return '今天天气晴朗，适合出门散步。';
  if (userMsg.includes('笑话')) return '为什么程序员喜欢用黑色主题？因为亮色主题会暴露 bug！';
  if (userMsg.includes('你是谁')) return '我是你的 AI 助手，很高兴为你服务！';
  if (userMsg.includes('代码')) return '当然可以，请问你需要哪种语言的代码？';
  return '收到！我会尽力帮你。';
}

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好，我是你的 AI 助手。' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (msg) => {
    const content = typeof msg === 'string' ? msg : input;
    if (!content.trim()) return;
    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setInput('');
    // mock AI 回复
    setTimeout(() => {
      const aiReply = mockAIReply(content);
      setMessages((prev) => [...prev, { role: 'assistant', content: aiReply }]);
      setHistory((prev) => [
        { user: content, ai: aiReply },
        ...prev.slice(0, 9), // 最多10条
      ]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="cursor-chat-layout">
      {/* 左侧对话区 */}
      <div className="cursor-chat-root">
        <div className="cursor-chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`cursor-chat-message ${msg.role === 'user' ? 'user' : 'assistant'}`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="cursor-chat-input-area">
          <textarea
            className="cursor-chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="请输入消息..."
            rows={1}
          />
          <button className="cursor-chat-send" onClick={() => handleSend()}>
            发送
          </button>
        </div>
      </div>
      {/* 右侧对话历史/快捷词区 */}
      <div className="cursor-chat-side">
        <div className="cursor-chat-side-section">
          <div className="cursor-chat-side-title">对话记录</div>
          <div className="cursor-chat-history-list">
            {history.length === 0 && <div className="cursor-chat-history-empty">暂无历史</div>}
            {history.map((item, idx) => (
              <div className="cursor-chat-history-item" key={idx}>
                <div className="history-user">你: {item.user}</div>
                <div className="history-ai">AI: {item.ai}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="cursor-chat-side-section">
          <div className="cursor-chat-side-title">快捷词</div>
          <div className="cursor-chat-quickwords">
            {QUICK_WORDS.map((word, idx) => (
              <button
                className="cursor-chat-quickword"
                key={idx}
                onClick={() => handleSend(word)}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
