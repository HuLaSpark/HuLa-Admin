import paging from '@/hooks/usePaging.ts'
import typeState from '@/hooks/useState.ts'
import { nextTick, ref } from 'vue'
import { banUser, kickOutUser, OnlineUserPage, unravelUser } from '@/api/online'

export const useOnline = () => {
  /*解构分页参数*/
  const { pageNum, pageSize, total } = paging
  /*解构状态类型参数*/
  const { disabled, showIcon, verify, loading, showModal } = typeState

  //定义初始化数据
  const tableData = ref<any[]>([])
  const input = ref<string>('')
  const imageList = ref<any[]>([])

  //判断表格中的数据是否符合标准
  let tableRowClassNameOnline: ({ row, rowIndex }: { row: any; rowIndex: number }) => void = ({
    row,
    rowIndex
  }: {
    row: any
    rowIndex: number
  }) => {
    if (row.userInfo.id >= 12) {
      return 'warning-row animate__animated animate__backInDown'
    } else if (row.userInfo.userName === 'wmy') {
      return 'success-row animate__animated animate__backInDown'
    }
    return 'animate__animated animate__backInDown'
  }

  //封禁用户
  const ban = async (info: any) => {
    await banUser(info.uid).then((res) => {
      if (res.code === '00000') {
        // ElMessage({
        // 	message: res.msg,
        // 	grouping: true,
        // 	type: 'success',
        // })
      } else {
        // ElMessage({
        // 	message: res.msg,
        // 	grouping: true,
        // 	type: 'error',
        // })
      }
    })
  }

  //解封用户
  const unravel = async (info: any) => {
    await unravelUser(info.uid).then((res) => {
      if (res.code === '00000') {
        // ElMessage({
        // 	message: res.msg,
        // 	grouping: true,
        // 	type: 'success',
        // })
      } else {
        // ElMessage({
        // 	message: res.msg,
        // 	grouping: true,
        // 	type: 'error',
        // })
      }
    })
  }

  //加载方法
  const load = async () => {
    loading.value = true
    const res = await OnlineUserPage()
    if (res.code === '00000') {
      setTimeout(() => {
        tableData.value = res.data
        //遍历获取图片url
        tableData.value.forEach((v) => {
          imageList.value.push(v.userInfo.url)
        })
        nextTick(() => {
          loading.value = false
        })
      }, 500)
    } else {
      // ElMessage({
      // 	message: res.msg,
      // 	grouping: true,
      // 	type: 'error',
      // })
    }
  }

  //把用户踢下线
  const kick = async (userInfo: any) => {
    await kickOutUser(userInfo.uid).then((res) => {
      if (res.code === '00000') {
        load()
        // ElMessage({
        // 	message: res.msg,
        // 	grouping: true,
        // 	type: 'success',
        // })
        tableRowClassNameOnline = ({ row }: { row: any }) => {
          if (row.userInfo.id === userInfo.id) {
            return 'animate__animated animate__bounceOutRight'
          }
          if (row.id >= 12) {
            return 'warning-row animate__animated animate__backInDown'
          } else if (row.userName === 'wmy') {
            return 'success-row animate__animated animate__backInDown'
          }
          return 'animate__animated animate__backInDown'
        }
      } else {
        // ElMessage({
        // 	message: res.msg,
        // 	grouping: true,
        // 	type: 'error',
        // })
      }
    })
  }

  //在线用户封禁
  const onlineBan = (info: any) => {
    ban(info)
      .then(() => {
        load()
      })
      .catch((e) => {
        console.log(e)
        // ElMessage({
        // 	message: e,
        // 	grouping: true,
        // 	type: 'error',
        // })
      })
  }

  //切换用户
  // const change = async (uid:any) => {
  //   await changeUser({uid: uid}).then(res => {
  //       if (res.code === "200"){
  //           ElMessage({
  //               message: res.msg,
  //               grouping: true,
  //               type: 'success',
  //           })
  //           load()
  //       }else {
  //           ElMessage({
  //               message: res.msg,
  //               grouping: true,
  //               type: 'error',
  //           })
  //           load()
  //       }
  //   })
  // }
  return {
    pageNum,
    pageSize,
    total,
    disabled,
    showIcon,
    verify,
    loading,
    showModal,
    tableData,
    imageList,
    load,
    kick,
    onlineBan,
    unravel,
    ban,
    tableRowClassNameOnline
  }
}
