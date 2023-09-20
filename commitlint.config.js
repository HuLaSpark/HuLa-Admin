module.exports = {
  extends: ['cz'],
  rules: {}
  // ignores: [(commit) => commit.includes('init')],
  // extends: ['@commitlint/config-conventional'],
  // rules: {
  // 	'body-leading-blank': [2, 'always'],
  // 	'footer-leading-blank': [1, 'always'],
  // 	'header-max-length': [2, 'always', 108],
  // 	'subject-empty': [2, 'never'],
  // 	'type-empty': [2, 'never'],
  // 	'type-enum': [
  // 		2,
  // 		'always',
  // 		[
  // 			'feat', //新特性、新功能
  // 			'fix', //修改bug
  // 			'perf', //优化相关，比如提升性能、体验
  // 			'style', //代码格式修改，注意不是css修改
  // 			'docs', //文档修改
  // 			'test', //测试用例修改
  // 			'refactor', //代码重构
  // 			'build', //编译相关的修改，例如发布版本，对项目构建或依赖的改动
  // 			'update', //更新某功能
  // 			'ci',
  // 			'chore', //其他修改，比如改变构建流程、或者增加依赖库、工具等
  // 			'revert', //回滚上一个版本
  // 			'wip',
  // 			'workflow',
  // 			'types',
  // 			'release',
  // 		],
  // 	],
  // },
}
