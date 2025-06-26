#!/usr/bin/env node

/**
 * 快速视觉修改工具
 * 使用方法：node quick-modify.js [command] [options]
 * 
 * 示例：
 * node quick-modify.js color --primary "#1E3A8A"
 * node quick-modify.js theme --preset "cool"
 * node quick-modify.js font --size "large"
 */

const fs = require('fs');
const path = require('path');

class QuickModify {
  constructor() {
    this.configPath = './visual-config.json';
    this.cssPath = './src/App.css';
    this.jsxPath = './src/App.jsx';
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    } catch (error) {
      console.error('❌ 无法加载配置文件:', error.message);
      process.exit(1);
    }
  }

  saveConfig() {
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    console.log('✅ 配置已保存');
  }

  // 修改颜色主题
  modifyColors(options) {
    console.log('🎨 修改颜色主题...');
    
    if (options.primary) {
      this.config.theme.colors.primary = options.primary;
      console.log(`✅ 主色调已改为: ${options.primary}`);
    }
    
    if (options.secondary) {
      this.config.theme.colors.secondary = options.secondary;
      console.log(`✅ 辅助色已改为: ${options.secondary}`);
    }
    
    if (options.background) {
      this.config.theme.colors.background = options.background;
      console.log(`✅ 背景色已改为: ${options.background}`);
    }
    
    if (options.preset) {
      const preset = this.config.quickModifications.colorSchemes[options.preset];
      if (preset) {
        Object.assign(this.config.theme.colors, preset);
        console.log(`✅ 已应用 ${options.preset} 色彩方案`);
      } else {
        console.log('❌ 未找到指定的色彩方案');
        return;
      }
    }
    
    this.updateCSS();
    this.saveConfig();
  }

  // 修改字体设置
  modifyTypography(options) {
    console.log('📝 修改字体设置...');
    
    if (options.size) {
      const sizeMap = {
        'small': { hero: '4rem', h1: '2rem', body: '0.875rem' },
        'medium': { hero: '6rem', h1: '3rem', body: '1rem' },
        'large': { hero: '8rem', h1: '4rem', body: '1.125rem' },
        'xlarge': { hero: '10rem', h1: '5rem', body: '1.25rem' }
      };
      
      if (sizeMap[options.size]) {
        Object.assign(this.config.typography.sizes, sizeMap[options.size]);
        console.log(`✅ 字体大小已调整为: ${options.size}`);
      }
    }
    
    if (options.heading) {
      this.config.typography.fonts.heading = options.heading;
      console.log(`✅ 标题字体已改为: ${options.heading}`);
    }
    
    if (options.body) {
      this.config.typography.fonts.body = options.body;
      console.log(`✅ 正文字体已改为: ${options.body}`);
    }
    
    this.updateCSS();
    this.saveConfig();
  }

  // 修改布局设置
  modifyLayout(options) {
    console.log('📐 修改布局设置...');
    
    if (options.style) {
      const preset = this.config.quickModifications.layoutStyles[options.style];
      if (preset) {
        this.config.layout.sections.padding = preset.sectionPadding;
        this.config.layout.cards.shadow = preset.cardShadow;
        this.config.layout.cards.borderRadius = preset.borderRadius;
        console.log(`✅ 已应用 ${options.style} 布局风格`);
      }
    }
    
    if (options.spacing) {
      const spacingMap = {
        'tight': '60px 0',
        'normal': '80px 0', 
        'loose': '120px 0'
      };
      
      if (spacingMap[options.spacing]) {
        this.config.layout.sections.padding = spacingMap[options.spacing];
        console.log(`✅ 间距已调整为: ${options.spacing}`);
      }
    }
    
    this.updateCSS();
    this.saveConfig();
  }

  // 修改动画设置
  modifyAnimations(options) {
    console.log('✨ 修改动画设置...');
    
    if (options.preset) {
      const preset = this.config.quickModifications.animationPresets[options.preset];
      if (preset) {
        this.config.animations.vinyl.speed = preset.vinylSpeed;
        this.config.animations.hover.scale = preset.hoverScale;
        this.config.animations.fadeIn.duration = preset.fadeInDuration;
        console.log(`✅ 已应用 ${options.preset} 动画预设`);
      }
    }
    
    if (options.vinyl !== undefined) {
      this.config.animations.vinyl.enabled = options.vinyl === 'true';
      console.log(`✅ 黑胶唱片动画: ${options.vinyl === 'true' ? '开启' : '关闭'}`);
    }
    
    if (options.hover !== undefined) {
      this.config.animations.hover.enabled = options.hover === 'true';
      console.log(`✅ 悬停效果: ${options.hover === 'true' ? '开启' : '关闭'}`);
    }
    
    this.updateCSS();
    this.saveConfig();
  }

  // 更新CSS文件
  updateCSS() {
    console.log('🔄 更新CSS样式...');
    
    try {
      let css = fs.readFileSync(this.cssPath, 'utf8');
      
      // 更新CSS变量
      const colorVars = `
  --bronze-gold: ${this.config.theme.colors.primary};
  --cinnabar-red: ${this.config.theme.colors.secondary};
  --ivory-white: ${this.config.theme.colors.background};
  --steel-gray: ${this.config.theme.colors.text};
  --pearl-silver: ${this.config.theme.colors.muted};`;
      
      // 替换CSS变量部分
      css = css.replace(
        /(--bronze-gold:.*?--pearl-silver:.*?;)/s,
        colorVars
      );
      
      fs.writeFileSync(this.cssPath, css);
      console.log('✅ CSS样式已更新');
    } catch (error) {
      console.error('❌ 更新CSS失败:', error.message);
    }
  }

  // 预览更改
  preview() {
    console.log('👀 当前配置预览:');
    console.log('');
    console.log('🎨 颜色主题:');
    console.log(`   主色调: ${this.config.theme.colors.primary}`);
    console.log(`   辅助色: ${this.config.theme.colors.secondary}`);
    console.log(`   背景色: ${this.config.theme.colors.background}`);
    console.log('');
    console.log('📝 字体设置:');
    console.log(`   标题字体: ${this.config.typography.fonts.heading}`);
    console.log(`   正文字体: ${this.config.typography.fonts.body}`);
    console.log(`   中文字体: ${this.config.typography.fonts.chinese}`);
    console.log('');
    console.log('✨ 动画设置:');
    console.log(`   黑胶动画: ${this.config.animations.vinyl.enabled ? '开启' : '关闭'}`);
    console.log(`   悬停效果: ${this.config.animations.hover.enabled ? '开启' : '关闭'}`);
    console.log(`   渐入效果: ${this.config.animations.fadeIn.enabled ? '开启' : '关闭'}`);
  }

  // 重置为默认设置
  reset() {
    console.log('🔄 重置为默认设置...');
    
    // 这里可以加载默认配置
    const defaultConfig = {
      theme: {
        colors: {
          primary: "#B8860B",
          secondary: "#CD5C5C",
          background: "#F8F8FF",
          text: "#2C3E50"
        }
      }
    };
    
    Object.assign(this.config, defaultConfig);
    this.updateCSS();
    this.saveConfig();
    
    console.log('✅ 已重置为默认设置');
  }

  // 构建和部署
  async build() {
    console.log('🔨 构建项目...');
    
    const { exec } = require('child_process');
    
    return new Promise((resolve, reject) => {
      exec('npm run build', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ 构建失败:', error.message);
          reject(error);
          return;
        }
        
        console.log('✅ 构建完成');
        console.log(stdout);
        resolve();
      });
    });
  }

  // 显示帮助信息
  showHelp() {
    console.log(`
🎨 HUANG / POESIA 快速视觉修改工具

使用方法:
  node quick-modify.js [command] [options]

命令:
  color     修改颜色主题
  font      修改字体设置  
  layout    修改布局设置
  animation 修改动画设置
  preview   预览当前配置
  reset     重置为默认设置
  build     构建项目
  help      显示帮助信息

颜色修改示例:
  node quick-modify.js color --primary "#1E3A8A"
  node quick-modify.js color --preset "cool"
  
字体修改示例:
  node quick-modify.js font --size "large"
  node quick-modify.js font --heading "Georgia"
  
布局修改示例:
  node quick-modify.js layout --style "modern"
  node quick-modify.js layout --spacing "loose"
  
动画修改示例:
  node quick-modify.js animation --preset "subtle"
  node quick-modify.js animation --vinyl "false"

可用预设:
  颜色: warm, cool, elegant, vibrant
  布局: minimal, modern, classic  
  动画: subtle, dynamic, static
`);
  }
}

// 命令行接口
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const modifier = new QuickModify();
  
  // 解析选项
  const options = {};
  for (let i = 1; i < args.length; i += 2) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const value = args[i + 1];
      options[key] = value;
    }
  }
  
  switch (command) {
    case 'color':
      modifier.modifyColors(options);
      break;
    case 'font':
      modifier.modifyTypography(options);
      break;
    case 'layout':
      modifier.modifyLayout(options);
      break;
    case 'animation':
      modifier.modifyAnimations(options);
      break;
    case 'preview':
      modifier.preview();
      break;
    case 'reset':
      modifier.reset();
      break;
    case 'build':
      modifier.build();
      break;
    case 'help':
    default:
      modifier.showHelp();
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = QuickModify;

