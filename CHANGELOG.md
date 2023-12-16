## <small>1.1.5-beta (2023-12-16)</small>

* :bug: fix(custom): 修复全局请求配置 ([6c56610](https://gitee.com/nongyehong/HuLa-vue3/commits/6c56610))
* :bug: fix(custom): 修复vite5版本导致的支持ESM的问题 ([c493bb3](https://gitee.com/nongyehong/HuLa-vue3/commits/c493bb3))
* :construction_worker: ci(custom): 忽略自动导入的文件 ([70a1685](https://gitee.com/nongyehong/HuLa-vue3/commits/70a1685))
* :construction_worker: ci(custom): 移除auto-imports.d.ts和components.d.ts文件 ([91c2ead](https://gitee.com/nongyehong/HuLa-vue3/commits/91c2ead))
* :lipstick: style(custom): tabs样式更改，其余样式美化 ([798169f](https://gitee.com/nongyehong/HuLa-vue3/commits/798169f))
* :new: version(custom): 发布v1.1.5-beta版本 ([2ff3ef7](https://gitee.com/nongyehong/HuLa-vue3/commits/2ff3ef7))
* :package: build(custom): 剔除没有用的文件 ([c53ddbb](https://gitee.com/nongyehong/HuLa-vue3/commits/c53ddbb))
* :package: build(custom): 优化打包配置 ([cda32f3](https://gitee.com/nongyehong/HuLa-vue3/commits/cda32f3))
* :rocket: chore(custom): 剔除rollup-plugin-terser依赖，使用@rollup/plugin-terser替换 ([bd1fe45](https://gitee.com/nongyehong/HuLa-vue3/commits/bd1fe45))
* :rocket: chore(custom): 提升打包速度和压缩率 ([890acf3](https://gitee.com/nongyehong/HuLa-vue3/commits/890acf3))
* :rocket: chore(custom): 修改lint工具 ([ee1e056](https://gitee.com/nongyehong/HuLa-vue3/commits/ee1e056))
* :sparkles: feat(custom): 使用jsrsasign实现RSA非对称加密第一版 ([fb802bd](https://gitee.com/nongyehong/HuLa-vue3/commits/fb802bd))
* :zap: perf: 优化提交检测 ([6d87c41](https://gitee.com/nongyehong/HuLa-vue3/commits/6d87c41))
* :zap: perf(custom): 更新依赖版本 ([891ed05](https://gitee.com/nongyehong/HuLa-vue3/commits/891ed05))
* :zap: perf(custom): 升级vite5版本 ([7e5686d](https://gitee.com/nongyehong/HuLa-vue3/commits/7e5686d))
* :zap: perf(custom): 使用jsencrypt来完善RSA加密 ([09aa51e](https://gitee.com/nongyehong/HuLa-vue3/commits/09aa51e))
* :zap: perf(custom): 完善项目配置文件，优化pinia持久化问题 ([c2557ea](https://gitee.com/nongyehong/HuLa-vue3/commits/c2557ea))
* :zap: perf(custom): 修复新增页面存留问题，完善其他功能 ([b382b49](https://gitee.com/nongyehong/HuLa-vue3/commits/b382b49))
* :zap: perf(custom): 修复RSA非对称加密使用依赖库导致的问题 ([9dcafd2](https://gitee.com/nongyehong/HuLa-vue3/commits/9dcafd2))
* :zap: perf(custom): 优化部分页面逻辑，新增tabs右键菜单功能 ([f99e51e](https://gitee.com/nongyehong/HuLa-vue3/commits/f99e51e))
* :zap: perf(custom): 优化配置文件问题 ([8412e0f](https://gitee.com/nongyehong/HuLa-vue3/commits/8412e0f))
* :zap: perf(custom): 优化项目配置功能 ([a7e1860](https://gitee.com/nongyehong/HuLa-vue3/commits/a7e1860))
* :zap: perf(custom): instanceType获取组件类型的实例 ([5309327](https://gitee.com/nongyehong/HuLa-vue3/commits/5309327))



## 1.1.0-beta (2023-11-25)

* :bug: fix(custom): 适配不同分辨率第一版 ([ecbca69](https://gitee.com/nongyehong/HuLa-vue3/commits/ecbca69))
* :bug: fix(custom): 修复除了媒体查询外样式不显示问题 ([5c334eb](https://gitee.com/nongyehong/HuLa-vue3/commits/5c334eb))
* :bug: fix(custom): 修复关于我们页面已知问题，修复抽屉和表格数据关联问题 ([325f016](https://gitee.com/nongyehong/HuLa-vue3/commits/325f016))
* :bug: fix(custom): 修复全局设置侧边栏颜色功能 ([e775709](https://gitee.com/nongyehong/HuLa-vue3/commits/e775709))
* :bug: fix(custom): 修复全局设置动画问题 ([a1d062a](https://gitee.com/nongyehong/HuLa-vue3/commits/a1d062a))
* :lipstick: style(custom): 使用storyset来做项目插画，完善alert样式 ([0c6903f](https://gitee.com/nongyehong/HuLa-vue3/commits/0c6903f))
* :lipstick: style(custom): 自定义alert样式 ([489da6c](https://gitee.com/nongyehong/HuLa-vue3/commits/489da6c))
* :new: version(custom): 发布v1.1.0-beta版本 ([148535e](https://gitee.com/nongyehong/HuLa-vue3/commits/148535e))
* :sparkles: feat(custom): 封装全局快捷键功能 ([80bcf56](https://gitee.com/nongyehong/HuLa-vue3/commits/80bcf56))
* :sparkles: feat(custom): 设置预览更换系统主题功能 ([9451b15](https://gitee.com/nongyehong/HuLa-vue3/commits/9451b15))
* :sparkles: feat(custom): 新增多租户选项功能 ([e95a5b8](https://gitee.com/nongyehong/HuLa-vue3/commits/e95a5b8))
* :sparkles: feat(custom): 新增全局搜索功能，优化部分功能 ([35a0241](https://gitee.com/nongyehong/HuLa-vue3/commits/35a0241))
* :sparkles: feat(custom): 新增全局搜索删除记录功能 ([46643af](https://gitee.com/nongyehong/HuLa-vue3/commits/46643af))
* :sparkles: feat(custom): tabs标签页第一版 ([8fa62aa](https://gitee.com/nongyehong/HuLa-vue3/commits/8fa62aa))
* :zap: perf(custom): 使用localforage来做indexedDB存储，优化角色权限下拉框 ([65dced8](https://gitee.com/nongyehong/HuLa-vue3/commits/65dced8))
* :zap: perf(custom): 完善角色下拉框功能 ([ddf8f35](https://gitee.com/nongyehong/HuLa-vue3/commits/ddf8f35))
* :zap: perf(custom): 完善快捷键功能 ([06667e5](https://gitee.com/nongyehong/HuLa-vue3/commits/06667e5))
* :zap: perf(custom): 完善全局的一些功能 ([97e242a](https://gitee.com/nongyehong/HuLa-vue3/commits/97e242a))
* :zap: perf(custom): 完善页面样式，增强页面交互 ([710f60c](https://gitee.com/nongyehong/HuLa-vue3/commits/710f60c))
* :zap: perf(custom): 优化个别功能逻辑和性能 ([0ac9d63](https://gitee.com/nongyehong/HuLa-vue3/commits/0ac9d63))
* :zap: perf(custom): 优化全局搜索框 ([4299f82](https://gitee.com/nongyehong/HuLa-vue3/commits/4299f82))
* :zap: perf(custom): tabs标签页功能完善 ([b86752d](https://gitee.com/nongyehong/HuLa-vue3/commits/b86752d))



## <small>1.0.5-alpha (2023-09-24)</small>

* :rewind: revert(custom): 回退到重构版本 ([39fe8f8](https://gitee.com/nongyehong/HuLa-vue3/commits/39fe8f8))
* :sparkles: feat(custom): 封装关于我们页面，使用tsx来渲染表格内容 ([bb889d1](https://gitee.com/nongyehong/HuLa-vue3/commits/bb889d1))
* :zap: perf(custom): 使用defer来优化白屏 ([68f367d](https://gitee.com/nongyehong/HuLa-vue3/commits/68f367d))
* 初始化仓库 ([3fec13e](https://gitee.com/nongyehong/HuLa-vue3/commits/3fec13e))



