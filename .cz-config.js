module.exports = {
  types: [
    {
      value: ':sparkles: feat',
      name: '✨  feat:     新功能'
    },
    {
      value: ':bug: fix',
      name: '🐛 fix:      修复bug'
    },
    {
      value: ':package: build',
      name: '📦️build:    打包'
    },
    {
      value: ':zap: perf',
      name: '⚡️ perf:     性能优化'
    },
    {
      value: ':tada: release',
      name: '🎉 release:  发布正式版'
    },
    {
      value: ':lipstick: style',
      name: '💄 style:    代码的样式美化'
    },
    {
      value: ':recycle: refactor',
      name: '♻️ refactor: 重构'
    },
    {
      value: ':pencil2: docs',
      name: '✏️ docs:     文档变更'
    },
    {
      value: ':white_check_mark: test',
      name: '✅  test:     测试'
    },
    {
      value: ':rewind: revert',
      name: '⏪️ revert:   回退'
    },
    {
      value: ':rocket: chore',
      name: '🚀 chore:    构建/工程依赖/工具'
    },
    {
      value: ':construction_worker: ci',
      name: '👷 ci:       CI related changes'
    }
  ],
  messages: {
    type: '请选择提交类型(必填)',
    customScope: '请输入文件修改范围(可选)',
    subject: '请简要描述提交(必填)',
    body: '请输入详细描述(可选)',
    breaking: '列出任何BREAKING CHANGES(可选)',
    footer: '请输入要关闭的issue(可选)',
    confirmCommit: '确定提交此说明吗？'
  },
  allowCustomScopes: true,
  // 跳过问题
  skipQuestions: ['body', 'footer'],
  subjectLimit: 72
}
