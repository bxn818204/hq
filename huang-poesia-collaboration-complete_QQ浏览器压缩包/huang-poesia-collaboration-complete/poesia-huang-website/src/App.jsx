import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  return (
    <div className="min-h-screen">
      {/* 导航栏 */}
      <nav className="fusion-nav fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="font-renaissance text-2xl text-bronze-gold tracking-wider">HUANG / POESIA</div>
            <div className="font-chinese text-sm text-steel-gray opacity-70">钢铁炼成的黄女士</div>
          </div>
          <div className="hidden md:flex space-x-8">
            {[
              { id: 'home', label: '首页' },
              { id: 'about', label: '关于' },
              { id: 'videos', label: '视频' },
              { id: 'writing', label: '写作' },
              { id: 'diary', label: '日记' },
              { id: 'newsletter', label: '订阅' },
              { id: 'social', label: '社交' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 rounded-lg transition-all duration-300"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 主页面 */}
      <main>
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 greek-pattern opacity-30"></div>
          
          <div className="text-center z-10 max-w-4xl mx-auto px-6">
            {/* 黑胶唱片 */}
            <div className="flex justify-center mb-12">
              <div className="vinyl-record relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-chinese text-lg text-ivory-white opacity-80">诗意创造</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 主标题 */}
            <h1 className="mb-8">
              <div className="font-renaissance text-8xl text-transparent bg-gradient-to-r from-bronze-gold via-cinnabar-red to-bronze-gold bg-clip-text mb-2 tracking-wider">
                HUANG / POESIA
              </div>
              <div className="font-chinese text-2xl text-steel-gray opacity-80">
                钢铁炼成的黄女士
              </div>
              <div className="text-center mt-4">
                <span className="text-bronze-gold text-4xl">•</span>
                <span className="font-decorative text-lg text-steel-gray mx-4 italic">La creazione è l'essenza dell'anima</span>
                <span className="text-bronze-gold text-4xl">•</span>
              </div>
            </h1>
            
            <div className="subtitle mb-8 tracking-[0.3em]">
              ARCHIVE · LEGACY · HERITAGE
            </div>

            <p className="font-chinese text-xl text-steel-gray mb-8 max-w-2xl mx-auto leading-relaxed">
              诗意创造者 | 内容中心 | 思想分发者
            </p>

            <div className="font-decorative text-steel-gray mb-12 italic">
              源自古希腊语 "poiesis" (ποίησις) - 将无形理念转化为有形物的创造过程
            </div>

            {/* 核心理念 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-bronze-gold to-cinnabar-red flex items-center justify-center">
                  <span className="text-ivory-white text-2xl">⚡</span>
                </div>
                <div className="font-greek text-steel-gray">内容转化</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-olive-green to-bronze-gold flex items-center justify-center">
                  <span className="text-ivory-white text-2xl">🌍</span>
                </div>
                <div className="font-greek text-steel-gray">多平台分发</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-steel-gray to-pearl-silver flex items-center justify-center">
                  <span className="text-ivory-white text-2xl">🔥</span>
                </div>
                <div className="font-greek text-steel-gray">持续创作</div>
              </div>
            </div>

            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('about')}
                className="fusion-button px-8 py-4 rounded-lg font-greek font-medium"
              >
                探索档案
              </button>
              <button 
                onClick={() => scrollToSection('newsletter')}
                className="elegant-hover px-8 py-4 border-2 border-bronze-gold text-bronze-gold rounded-lg font-greek font-medium"
              >
                订阅传承
              </button>
            </div>

            <div className="mt-12 text-center">
              <p className="font-chinese text-steel-gray mb-2">自主内容平台 · 摆脱算法束缚 · 向全世界分发思想</p>
              <p className="font-greek text-sm text-pearl-silver">Global Content Hub & Distribution</p>
            </div>
          </div>
        </section>

        {/* 关于我 */}
        <section id="about" className="chinese-spacing bg-gradient-to-br from-ivory-white to-muted">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-renaissance text-4xl text-center text-steel-gray mb-16">关于我</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="fusion-card">
                <blockquote className="font-chinese text-2xl text-steel-gray leading-relaxed mb-6">
                  "我是两个孩子的妈妈，37岁，具有文科背景。对AI技术与人文、哲学的交叉领域特别感兴趣，
                  拥有强烈的好奇心。过去是金融行业从业人员。"
                </blockquote>
                
                <p className="font-chinese text-lg text-steel-gray leading-relaxed mb-6">
                  我偏好探索更深层、更内心的内容主题，例如人性、文化、世界以及非套路化的商业调整，
                  希望通过这种方式打造个人IP品牌。
                </p>
                
                <div className="font-decorative text-xl text-cinnabar-red italic text-center">
                  "酷的妈妈，有自己的主意，没有人设，活明白了"
                </div>
              </div>

              <div className="space-y-8">
                <div className="fusion-card">
                  <h3 className="font-renaissance text-xl text-bronze-gold mb-4 flex items-center">
                    <span className="mr-3">✨</span> 创作理念
                  </h3>
                  <p className="font-chinese text-steel-gray leading-relaxed">
                    从古希腊的"poiesis"出发，相信所有艺术本质上都是将无形理念转化为有形物的过程。
                  </p>
                </div>

                <div className="fusion-card">
                  <h3 className="font-renaissance text-xl text-bronze-gold mb-4 flex items-center">
                    <span className="mr-3">🔄</span> 内容策略
                  </h3>
                  <p className="font-chinese text-steel-gray leading-relaxed">
                    每日更新的内容可以互相转化：一句话记录扩展成文章，文章制作成视频，视频提取金句，形成完整的内容生态。
                  </p>
                </div>

                <div className="fusion-card">
                  <h3 className="font-renaissance text-xl text-bronze-gold mb-4 flex items-center">
                    <span className="mr-3">🌍</span> 平台愿景
                  </h3>
                  <p className="font-chinese text-steel-gray leading-relaxed">
                    建立自主控制的内容中心，摆脱社交媒体算法的束缚，向全世界自由分发思想与创作。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 我的视频 */}
        <section id="videos" className="chinese-spacing">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-renaissance text-4xl text-center text-steel-gray mb-16">我的视频</h2>
            <p className="font-chinese text-center text-steel-gray mb-12 text-lg">
              通过视频分享深度思考，记录创作过程，传递有温度的观点
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "AI时代的人文反思", duration: "12:34", views: "2.1K", time: "3天前", gradient: "from-purple-500 to-blue-600" },
                { title: "创作的本质：从Poiesis说起", duration: "8:45", views: "1.8K", time: "1周前", gradient: "from-orange-500 to-red-600" },
                { title: "母亲与创作者的双重身份", duration: "15:22", views: "3.2K", time: "2周前", gradient: "from-pink-500 to-purple-600" },
                { title: "摆脱算法束缚的思考", duration: "10:18", views: "1.5K", time: "3周前", gradient: "from-green-500 to-teal-600" },
                { title: "投资中的人性洞察", duration: "14:56", views: "2.7K", time: "1个月前", gradient: "from-blue-500 to-purple-600" },
                { title: "现代女性的身份重构", duration: "11:33", views: "2.3K", time: "1个月前", gradient: "from-purple-500 to-pink-600" }
              ].map((video, index) => (
                <div key={index} className="fusion-card elegant-hover group cursor-pointer">
                  <div className={`aspect-video rounded-lg bg-gradient-to-br ${video.gradient} mb-4 relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[10px] border-y-transparent ml-1"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-greek">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-renaissance text-lg text-steel-gray mb-2 group-hover:text-bronze-gold transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex justify-between text-sm font-greek text-pearl-silver">
                    <span>{video.views} 观看</span>
                    <span>{video.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="elegant-hover px-8 py-3 bg-gradient-to-r from-bronze-gold to-cinnabar-red text-ivory-white rounded-lg font-greek">
                查看更多视频
              </button>
            </div>
          </div>
        </section>

        {/* 写作作品 */}
        <section id="writing" className="chinese-spacing bg-gradient-to-br from-muted to-ivory-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-renaissance text-4xl text-center text-steel-gray mb-16">写作作品</h2>
            <p className="font-chinese text-center text-steel-gray mb-12 text-lg">
              深度思考的文字记录，从人性到文化，从哲学到商业的全方位探索
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { category: "技术哲学", title: "AI时代的人文思考", excerpt: "当人工智能重塑世界时，我们如何保持人性的温度与深度？", date: "2024年12月", readTime: "8分钟" },
                { category: "文化观察", title: "现代女性的身份重构", excerpt: "在传统与现代的交汇点，探索女性身份的多重可能性。", date: "2024年11月", readTime: "6分钟" },
                { category: "商业思考", title: "投资中的人性洞察", excerpt: "超越数字和图表，理解投资背后的人性驱动力。", date: "2024年10月", readTime: "10分钟" },
                { category: "艺术哲学", title: "创作的本质：从Poiesis说起", excerpt: "回到古希腊的智慧，重新理解创作的本质含义。", date: "2024年9月", readTime: "12分钟" },
                { category: "媒体批评", title: "算法时代的自主性", excerpt: "如何在被算法包围的世界中保持思考的独立性？", date: "2024年8月", readTime: "7分钟" },
                { category: "个人思考", title: "母亲身份与创作者身份", excerpt: "在育儿与创作之间寻找平衡，探索身份的多重维度。", date: "2024年7月", readTime: "9分钟" }
              ].map((article, index) => (
                <div key={index} className="fusion-card elegant-hover group cursor-pointer">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-bronze-gold to-cinnabar-red text-ivory-white rounded-full text-sm font-greek">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="font-renaissance text-xl text-steel-gray mb-3 group-hover:text-bronze-gold transition-colors">
                    {article.title}
                  </h3>
                  <p className="font-chinese text-steel-gray leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex justify-between text-sm font-greek text-pearl-silver">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="elegant-hover px-8 py-3 bg-gradient-to-r from-bronze-gold to-cinnabar-red text-ivory-white rounded-lg font-greek">
                查看更多文章
              </button>
            </div>
          </div>
        </section>

        {/* 一句话记录 */}
        <section id="diary" className="chinese-spacing">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-renaissance text-4xl text-center text-steel-gray mb-16">一句话记录</h2>
            <p className="font-chinese text-center text-steel-gray mb-12 text-lg">
              每日的思考片段，生活的诗意瞬间，创作的灵感火花
            </p>

            <div className="space-y-8">
              {[
                { date: "2024年12月23日", mood: "思考", content: "真正的创作不是为了迎合算法，而是为了与灵魂对话。", tags: ["#创作", "#算法", "#灵魂"] },
                { date: "2024年12月22日", mood: "温暖", content: "今天女儿问我什么是诗，我说诗就是把心里的感受变成别人也能看见的样子。", tags: ["#育儿", "#诗歌", "#表达"] },
                { date: "2024年12月21日", mood: "深思", content: "在这个信息过载的时代，沉默也是一种表达，留白也是一种创作。", tags: ["#信息", "#沉默", "#留白"] },
                { date: "2024年12月20日", mood: "感悟", content: "每个人都是自己生活的导演，但很多人却把剧本交给了别人。", tags: ["#生活", "#自主", "#选择"] },
                { date: "2024年12月19日", mood: "洞察", content: "投资最难的不是分析数据，而是理解人性，包括自己的人性。", tags: ["#投资", "#人性", "#自我"] }
              ].map((record, index) => (
                <div key={index} className="fusion-card">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-bronze-gold rounded-full mr-3"></div>
                    <span className="font-greek text-steel-gray">{record.date}</span>
                    <span className="ml-auto px-3 py-1 bg-gradient-to-r from-olive-green to-bronze-gold text-ivory-white rounded-full text-sm font-greek">
                      {record.mood}
                    </span>
                  </div>
                  <blockquote className="font-chinese text-xl text-steel-gray leading-relaxed mb-4 italic border-l-4 border-bronze-gold pl-6">
                    "{record.content}"
                  </blockquote>
                  <div className="flex flex-wrap gap-2">
                    {record.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-sm font-greek text-bronze-gold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="elegant-hover px-8 py-3 bg-gradient-to-r from-bronze-gold to-cinnabar-red text-ivory-white rounded-lg font-greek">
                查看更多记录
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter 订阅 */}
        <section id="newsletter" className="chinese-spacing bg-gradient-to-br from-steel-gray to-ink-black text-ivory-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-renaissance text-4xl mb-8">订阅我的 Newsletter</h2>
            <p className="font-chinese text-xl mb-12 opacity-90">
              每周精选内容直达您的邮箱：深度思考、创作心得、生活感悟
            </p>

            <div className="fusion-card bg-gradient-to-br from-ivory-white/10 to-pearl-silver/10 backdrop-blur-sm border-pearl-silver/20 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-bronze-gold to-cinnabar-red rounded-full flex items-center justify-center">
                  <span className="text-2xl">📡</span>
                </div>
                <h3 className="font-renaissance text-2xl text-bronze-gold mb-2">POESIA 周刊</h3>
                <p className="font-chinese text-ivory-white/80">
                  获取最新的思考、创作和生活分享，以及独家内容预览
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="email"
                  placeholder="输入您的邮箱地址"
                  className="flex-1 px-4 py-3 rounded-lg bg-ivory-white/10 border border-pearl-silver/30 text-ivory-white placeholder-ivory-white/60 focus:outline-none focus:border-bronze-gold"
                />
                <button className="elegant-hover px-8 py-3 bg-gradient-to-r from-bronze-gold to-cinnabar-red text-ivory-white rounded-lg font-greek">
                  订阅更新
                </button>
              </div>

              <div className="text-sm font-greek text-ivory-white/60 space-y-1">
                <p>每周发送，随时可以取消订阅</p>
                <p>您的邮箱信息将被安全保护</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-bronze-gold to-olive-green rounded-full flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
                <h4 className="font-renaissance text-xl text-bronze-gold mb-2">深度文章</h4>
                <p className="font-chinese text-ivory-white/80">每周精选的深度思考文章</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cinnabar-red to-bronze-gold rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎥</span>
                </div>
                <h4 className="font-renaissance text-xl text-bronze-gold mb-2">视频更新</h4>
                <p className="font-chinese text-ivory-white/80">最新视频内容和创作花絮</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-olive-green to-steel-gray rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h4 className="font-renaissance text-xl text-bronze-gold mb-2">独家内容</h4>
                <p className="font-chinese text-ivory-white/80">订阅者专享的思考和分享</p>
              </div>
            </div>
          </div>
        </section>

        {/* 社交媒体 */}
        <section id="social" className="chinese-spacing bg-gradient-to-br from-ivory-white to-muted">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-renaissance text-4xl text-center text-steel-gray mb-16">社交媒体</h2>
            <p className="font-chinese text-center text-steel-gray mb-12 text-lg">
              在不同平台与我连接，获取多样化的内容形式和实时更新
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                { platform: "小红书", handle: "@钢铁炼成的黄女士", description: "生活分享与深度思考", followers: "4K", color: "from-pink-500 to-red-500", icon: "📷" },
                { platform: "微信公众号", handle: "钢铁炼成的黄女士", description: "长文章与深度分析", followers: "2K", color: "from-green-500 to-teal-500", icon: "💬" },
                { platform: "YouTube", handle: "@PoesiaHuang", description: "视频内容与创作过程", followers: "1.2K", color: "from-red-500 to-pink-500", icon: "🎥" },
                { platform: "Twitter", handle: "@PoesiaHuang", description: "实时思考与互动", followers: "800", color: "from-blue-500 to-purple-500", icon: "🐦" }
              ].map((social, index) => (
                <div key={index} className="fusion-card elegant-hover text-center group cursor-pointer">
                  <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${social.color} rounded-full flex items-center justify-center text-3xl`}>
                    {social.icon}
                  </div>
                  <h3 className="font-renaissance text-xl text-steel-gray mb-2 group-hover:text-bronze-gold transition-colors">
                    {social.platform}
                  </h3>
                  <p className="font-greek text-bronze-gold mb-2">{social.handle}</p>
                  <p className="font-chinese text-steel-gray text-sm mb-4">{social.description}</p>
                  <div className="text-2xl font-renaissance text-bronze-gold">{social.followers}</div>
                  <div className="text-sm font-greek text-pearl-silver">关注者</div>
                </div>
              ))}
            </div>

            {/* 内容分发策略 */}
            <div className="fusion-card">
              <h3 className="font-renaissance text-2xl text-center text-bronze-gold mb-12">内容分发策略</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h4 className="font-renaissance text-lg text-steel-gray mb-4 flex items-center justify-center">
                    <span className="mr-2">→</span> 一句话记录
                  </h4>
                  <p className="font-chinese text-steel-gray text-sm leading-relaxed">
                    每日思考 → 小红书动态 → Twitter推文 → 微信朋友圈
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-renaissance text-lg text-steel-gray mb-4 flex items-center justify-center">
                    <span className="mr-2">→</span> 深度文章
                  </h4>
                  <p className="font-chinese text-steel-gray text-sm leading-relaxed">
                    长文写作 → 微信公众号 → 网站博客 → 视频脚本
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-renaissance text-lg text-steel-gray mb-4 flex items-center justify-center">
                    <span className="mr-2">→</span> 视频内容
                  </h4>
                  <p className="font-chinese text-steel-gray text-sm leading-relaxed">
                    视频制作 → YouTube → 小红书 → 提取金句分发
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-gradient-to-r from-steel-gray to-ink-black text-ivory-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="font-renaissance text-3xl text-bronze-gold mb-4">钢铁炼成的黄女士</h3>
          <p className="font-chinese text-ivory-white/80 mb-6">诗意创造者 · 自主内容平台 · 思想分发中心</p>
          <div className="border-t border-ivory-white/20 pt-6">
            <p className="font-greek text-sm text-ivory-white/60">
              © 2024 钢铁炼成的黄女士. 版权所有权利.
            </p>
            <p className="font-decorative text-sm text-ivory-white/40 mt-2">
              源自古希腊语 "poiesis" - 创造的本质
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

