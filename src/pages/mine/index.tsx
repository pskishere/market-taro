import { View, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import React from 'react'
import { Add } from '@nutui/icons-react-taro'

interface MenuItem {
  id: string
  icon: string
  title: string
  desc?: string
  arrow?: boolean
  onClick?: () => void
}

export default function Mine() {
  // 获取系统信息
  const [systemInfo] = useState(() => Taro.getSystemInfoSync())
  const safeAreaTop = systemInfo?.safeArea?.top || 0

  // 功能菜单列表
  const menuList: MenuItem[][] = [
    [
      {
        id: 'messages',
        icon: 'Mail',
        title: '我的消息',
        desc: '2条新消息',
        arrow: true,
        onClick: () => {
          Taro.navigateTo({
            url: '../message/index'
          })
        }
      },
      {
        id: 'posts',
        icon: 'Description',
        title: '我的发布',
        desc: '12条',
        arrow: true,
        onClick: () => {
          Taro.showToast({ title: '功能开发中', icon: 'none' })
        }
      },
      {
        id: 'collections',
        icon: 'Bookmark',
        title: '我的收藏',
        desc: '56条',
        arrow: true,
        onClick: () => {
          Taro.showToast({ title: '功能开发中', icon: 'none' })
        }
      }
    ],
    [
      {
        id: 'settings',
        icon: 'Settings',
        title: '设置',
        arrow: true,
        onClick: () => {
          Taro.showToast({ title: '功能开发中', icon: 'none' })
        }
      },
      {
        id: 'feedback',
        icon: 'Chat',
        title: '意见反馈',
        arrow: true,
        onClick: () => {
          Taro.showToast({ title: '功能开发中', icon: 'none' })
        }
      },
      {
        id: 'about',
        icon: 'Info',
        title: '关于我们',
        arrow: true,
        onClick: () => {
          Taro.showToast({ title: '功能开发中', icon: 'none' })
        }
      }
    ]
  ]

  // 添加发帖导航函数
  const handleNavigateToPost = () => {
    Taro.navigateTo({
      url: '../post/index'
    })
  }

  return (
    <View style={{
      background: '#FFFAF0',
      paddingTop: `${safeAreaTop / 2}px`
    }}>
      {/* 用户信息卡片 */}
      <View style={{
        marginLeft: '16px',
        marginRight: '16px',
        marginBottom: '16px',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '2px solid #2D2D2D'
      }}>
        <View style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px'
        }}>
          <Image
            src='https://example.com/avatar.jpg'
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '32px',
              border: '2px solid #2D2D2D'
            }}
          />
          <View style={{ flex: 1 }}>
            <View style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#2D2D2D',
              marginBottom: '4px'
            }}>
              用户昵称
            </View>
            <View style={{
              fontSize: '14px',
              color: '#666666'
            }}>
              ID: 888888
            </View>
          </View>
        </View>

        {/* 数据统计 */}
        <View style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '20px',
          borderTop: '1px solid #EAEAEA'
        }}>
          {[
            { label: '发布', value: '12' },
            { label: '获赞', value: '234' },
            { label: '收藏', value: '56' }
          ].map((item, index) => (
            <View
              key={index}
              style={{
                textAlign: 'center'
              }}
            >
              <View style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#2D2D2D',
                marginBottom: '4px'
              }}>
                {item.value}
              </View>
              <View style={{
                fontSize: '12px',
                color: '#666666'
              }}>
                {item.label}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 功能菜单 */}
      {menuList.map((group, groupIndex) => (
        <View
          key={groupIndex}
          style={{
            margin: '16px',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '2px solid #2D2D2D'
          }}
        >
          {group.map((item, index) => (
            <View
              key={item.id}
              onClick={item.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                borderBottom: index === group.length - 1 ? 'none' : '1px solid #EAEAEA',
                cursor: 'pointer'
              }}
            >

              <View style={{
                flex: 1,
                fontSize: '16px',
                color: '#2D2D2D'
              }}>
                {item.title}
              </View>
              {item.desc && (
                <View style={{
                  fontSize: '14px',
                  color: '#666666',
                  marginRight: '8px'
                }}>
                  {item.desc}
                </View>
              )}
              {item.arrow && (
                <View style={{
                  fontSize: '16px',
                  color: '#999999'
                }}>
                  →
                </View>
              )}
            </View>
          ))}
        </View>
      ))}

      {/* 添加浮动发帖按钮 */}
      <View 
        onClick={handleNavigateToPost}
        style={{
          position: 'fixed',
          right: '20px',
          bottom: `${safeAreaTop + 20}px`,
          width: '56px',
          height: '56px',
          // background: '#FF4B4B',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #2D2D2D'
        }}
      >
        <Add color='red' />
      </View>
    </View>
  )
}

// 添加页面配置
definePageConfig({
  navigationBarTitleText: '我的',
  navigationBarBackgroundColor: '#FFFAF0',
  navigationBarTextStyle: 'black',
  backgroundColor: '#FFFAF0'
}) 