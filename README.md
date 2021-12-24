# Drawing Board Website

网络画板

## 环境说明

软件测试环境：Chrome 96+，理论上支持Chrome 70+浏览器，无法兼容IE，其余浏览器未做测试

## 版本说明

- master - 最新稳定版本（已合并分支1.7）
  - 0.1（未提交）
    - 初始版本，实现手动绘图基本功能
    - 完成铅笔、钢笔、直线、圆以、矩形以及三角形功能实现以及基本画板布局
  - 0.2 
    - 新增星形功能实现
    - 优化橡皮擦渲染方式
  - 0.3 
    - 新增清屏按钮；
  - 0.4 
    - 新增坐标轴以及坐标网格
    - 新增随鼠标移动的坐标提示框
  - 0.5
    - 新增线型选择功能
    - 增加调色盘可选颜色数量
  - 1.0
    - 修复鼠标移出画布界面时可能导致绘图错误的问题
    - 新增任意多边形工具
    - 修复任意多边形功能下在鼠标快速移动时绘图异常的现象
  - 1.1 
    - 美化画板页面背景，并优化背景图片渲染效果
    - 新增公式输入部分界面
    - 新增画布缩放功能
  - 1.2
    - 新增数学公式解析功能，支持部分基本初等函数：sin、cos、tan、ln、lg、log、sqrt
  - 1.3
    - 优化函数解析算法，实现在部分输入不规范情况下的自动补全功能（乘法符号缺省、括号缺省补全）
  - 1.4
    - 优化画布缩放功能
    - 修复在放大/缩小模式下绘图时存在的缩放比例问题
  - 1.5 
    - 优化公式检错函数，增加错误提示类型
  - 1.6
    - 新增画板保存图片功能
    - 修复数学公式所绘制图像在缩放时存在的比例异常问题
  - 1.7
    - 调整画板页面布局
    - 新增坐标网格开关、鼠标标度开关
    - 修复三角形功能在缩放时出现的绘图错误问题
    - 修复缩放时绘制图像粗细不一致的问题
  - 1.8
    - 修复移动画布是坐标轴及坐标不随之移动的问题
    - 修复移动功能下部分工具所绘制图形不随之移动的问题
    - 修复星形工具绘图时线条不闭合的问题