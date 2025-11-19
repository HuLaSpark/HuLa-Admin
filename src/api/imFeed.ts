import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'

/** 游标翻页请求参数 */
export interface CursorPageReq {
  /** 每页数量 */
  pageSize: number
  /** 游标，首次查询可不传或传 null/空字符串 */
  cursor?: string | null
  /** 用户昵称搜索关键词 */
  userName?: string
}

/** 游标翻页返回 */
export interface CursorPageResp<T> {
  /** 下次查询时携带的游标 */
  cursor: string | null
  /** 是否最后一页 */
  isLast: boolean
  /** 数据列表 */
  list: T[]
  /** 总数 */
  total: number
}

/** 朋友圈列表项 */
export interface ImFeedItem {
  /** 朋友圈 ID */
  id: string
  /** 发布人 UID */
  uid: string
  /** 文案内容 */
  content: string
  /** 权限：privacy/open/partVisible/notAnyone 等 */
  permission: string
  /** 媒体类型：0 文本、1 图片、2 视频 */
  mediaType: number
  /** 媒体 URL 列表 */
  urls?: string[]
  /** 点赞数量 */
  likeCount?: number
  /** 评论数量 */
  commentCount?: number
  /** 当前登录用户是否已点赞 */
  hasLiked?: boolean
  /** 点赞用户列表（这里只保留类型提示） */
  likeList?: any[]
  /** 评论列表（这里只保留类型提示） */
  commentList?: any[]
  /** 发布人昵称 */
  userName?: string
  /** 发布人头像 */
  userAvatar?: string
  /** 创建时间 */
  createTime?: string
}

/**
 * 获取朋友圈列表
 */
export function getImFeedList(data: CursorPageReq): Promise<CursorPageResp<ImFeedItem>> {
  return request<CursorPageResp<ImFeedItem>>({
    url: '/feed/list',
    method: 'post',
    data,
    module: RequestModule.IM
  })
}

/**
 * 删除朋友圈
 */
export function deleteImFeed(feedId: string): Promise<void> {
  return request<void>({
    url: '/feed/del',
    method: 'post',
    data: {
      feedId
    },
    module: RequestModule.IM
  })
}

export interface FeedComment {
  id: string
  feedId: string
  uid: string
  userName: string
  userAvatar?: string
  content: string
  replyCommentId?: string
  replyUid?: string
  replyUserName?: string
  createTime: string
}

export function getImFeedComments(feedId: string): Promise<FeedComment[]> {
  return request<FeedComment[]>({
    url: '/feed/comment/all',
    method: 'get',
    params: {
      feedId
    },
    module: RequestModule.IM
  })
}

export function deleteImFeedComment(commentId: string): Promise<void> {
  return request<void>({
    url: '/feed/comment/del',
    method: 'post',
    data: {
      commentId
    },
    module: RequestModule.IM
  })
}
