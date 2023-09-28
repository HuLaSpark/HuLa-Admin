import type { MessageRenderMessage } from 'naive-ui'
import { NTag, NAlert } from 'naive-ui'
/*自定义message模板*/
export const renderMessage: MessageRenderMessage = ({ type, content, closable, onClose }) => {
  return (
    <NAlert
      closable={closable}
      onClose={onClose}
      type={type === 'loading' ? 'default' : type}
      title={'权限不足'}
      style={{
        boxShadow: 'var(--n-box-shadow)',
        maxWidth: 'calc(100vw - 32px)',
        width: '480px'
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <p>你没有足够的权限选择</p>
        <NTag type={'error'} style={{ borderRadius: '6px' }} bordered={false}>
          {content}
        </NTag>
        <p>角色</p>
      </div>
    </NAlert>
  )
}
