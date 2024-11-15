import { View, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

interface UserInfo {
  avatarUrl: string;
  nickName: string;
}

export default function MinePage() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    avatarUrl: 'https://placeholder.com/150',
    nickName: '未登录'
  })

  const menuItems = [
    { id: '1', title: '我的收藏', icon: '❤️' },
    { id: '2', title: '浏览历史', icon: '🕒' },
    { id: '3', title: '我的评价', icon: '✍️' },
    { id: '4', title: '意见反馈', icon: '📝' },
    { id: '5', title: '设置', icon: '⚙️' },
    { id: '6', title: '关于我们', icon: '📱' },
  ]

  const handleLogin = async () => {
    try {
      await Taro.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
          setUserInfo({
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName
          })
        }
      })
    } catch (error) {
      console.log('登录失败:', error)
    }
  }

  const handleMenuClick = (id: string) => {
    // TODO: 处理菜单点击
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }

  return (
    <View className='mine-page'>
      {/* 用户信息区域 */}
      <View className='user-section'>
        <View className='user-info' onClick={handleLogin}>
          <Image
            className='avatar'
            src={userInfo.avatarUrl}
            mode='aspectFill'
          />
          <View className='name'>{userInfo.nickName}</View>
        </View>
      </View>

      {/* 菜单列表 */}
      <View className='menu-list'>
        {menuItems.map(item => (
          <View
            key={item.id}
            className='menu-item'
            onClick={() => handleMenuClick(item.id)}
          >
            <View className='menu-icon'>{item.icon}</View>
            <View className='menu-title'>{item.title}</View>
            <View className='menu-arrow'>›</View>
          </View>
        ))}
      </View>

      {/* 版本信息 */}
      <View className='version-info'>
        <Text className='version-text'>版本 1.0.0</Text>
      </View>
    </View>
  )
} 