// 在文件顶部添加页面配置
definePageConfig({
  navigationStyle: 'custom'
})

import { View, Input, Map, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { showToast } from '@tarojs/taro'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { 
  setKeyword, 
  setSuggestions, 
  setSearchActive 
} from '../../store/search/actions'
import { User, Search, PickedUp, Close, Target } from '@nutui/icons-react-taro'
import { IconFont } from '@nutui/icons-react-taro'

interface Location {
  latitude: number
  longitude: number
  name?: string
  address?: string
}

interface TouchEvent {
  touches: Array<{
    clientY: number
  }>
}

// 添加热门目的地数据
const hotDestinations = [
  {
    name: '东京',
    description: '日本最大都市',
    icon: '📍'
  },
  {
    name: '巴厘岛',
    description: '印尼度假胜地',
    icon: '📍'
  },
  {
    name: '巴黎',
    description: '法国浪漫之都',
    icon: '📍'
  },
  {
    name: '曼谷',
    description: '泰国文化之都',
    icon: '📍'
  },
  {
    name: '纽约',
    description: '世界金融中心',
    icon: '📍'
  }
]

// 添加美食推荐数据
const foodRecommendations = [
  {
    name: '寿司',
    description: '日本传统美食',
    icon: '🍣'
  },
  {
    name: '泰式冬阴功',
    description: '泰国特色美食',
    icon: '🍜'
  },
  {
    name: '法式可颂',
    description: '法国传统面包',
    icon: '🥐'
  },
  {
    name: '意大利面',
    description: '意大利经典美食',
    icon: '🍝'
  }
]

// 添加发布点数据接口
interface BusinessPoint {
  id: string
  name: string
  address: string
  distance: string
  type: string
  rating: number
  reviewCount: number
  timeSlots: string[]
  latitude: number
  longitude: number
}

// 模拟附近发布点数据
const nearbyPoints: BusinessPoint[] = [
  {
    id: '1',
    name: '星巴克咖啡',
    address: '北京市朝阳区三里屯太古里北区N1-12号',
    distance: '500m',
    type: '咖啡店',
    rating: 4.8,
    reviewCount: 2341,
    timeSlots: ['10:00-14:00', '17:00-21:00'],
    latitude: 39.908775 + 0.001,
    longitude: 116.406315 + 0.001
  },
  {
    id: '2',
    name: '海底捞火锅',
    address: '北京市朝阳区三里屯路19号三里屯太古里南区地下一层',
    distance: '750m',
    type: '火锅店',
    rating: 4.9,
    reviewCount: 5231,
    timeSlots: ['11:00-14:30', '16:30-23:00'],
    latitude: 39.908775 + 0.002,
    longitude: 116.406315 + 0.002
  },
  {
    id: '3',
    name: '优衣库',
    address: '北京市朝阳区三里屯路19号三里屯太古里南区B1层',
    distance: '800m',
    type: '服装店',
    rating: 4.6,
    reviewCount: 1892,
    timeSlots: ['10:00-22:00'],
    latitude: 39.908775 + 0.003,
    longitude: 116.406315 + 0.003
  }
]

// 在文件顶部添加接口定义
interface Marker {
  id: number
  latitude: number
  longitude: number
  iconPath: string
  width: number
  height: number
  callout?: {
    content: string
    color: string
    fontSize: number
    borderRadius: number
    bgColor: string
    padding: number
    display: 'ALWAYS' | 'BYCLICK'
    textAlign: 'left' | 'right' | 'center'
    anchorX: number
    anchorY: number
    borderWidth: number
    borderColor: string
  }
}

// 添加模拟数据生成函数
const generateNearbyMarkers = (centerLat: number, centerLng: number): Marker[] => {
  const markers: Marker[] = []
  const places = [
    '星巴克咖啡', '网红餐厅', '购物中心', '电影院',
    '健身房', '公园', '图书馆', '美食广场'
  ]
  
  // 生成8个随机位置的标记点
  for (let i = 0; i < 8; i++) {
    // 在中心点周围随机生成坐标（范围约2公里内）
    const lat = centerLat + (Math.random() - 0.5) * 0.02
    const lng = centerLng + (Math.random() - 0.5) * 0.02
    
    markers.push({
      id: i + 1,
      latitude: lat,
      longitude: lng,
      iconPath: 'https://example.com/path/to/your/avatar.png', // 替换为圆形头像的 URL
      width: 40, // 设置宽度
      height: 40, // 设置高度
      callout: {
        content: places[i],
        fontSize: 14,
        color: '#333333',
        bgColor: '#FFFFFF',
        padding: 8,
        borderRadius: 4,
        display: 'ALWAYS',
        textAlign: 'center',
        anchorX: 0,
        anchorY: 0,
        borderWidth: 1,
        borderColor: '#FFFFFF'
      }
    })
  }
  return markers
}

// 在文件顶部添加搜索建议接口
interface SearchSuggestion {
  id: string;
  text: string;
  subText: string;
  icon: string;
  type: 'location' | 'food' | 'activity';
}

// 修改 SearchBar 组件
const SearchBar = () => {
  const dispatch = useDispatch()
  const { keyword, suggestions, isSearchActive } = useSelector((state: RootState) => state.search)
  const windowInfo = Taro.getWindowInfo()
  const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
  const statusBarHeight = windowInfo.statusBarHeight || 20
  const menuButtonPadding = menuButtonInfo.top - statusBarHeight

  // 修��搜索建议的数据结构和模拟数据
  const mockSuggestions: SearchSuggestion[] = [
    // 热门目的地
    { id: '1', text: '东京', subText: '日本最大都市', icon: '📍', type: 'location' },
    { id: '2', text: '巴厘岛', subText: '印尼度假胜地', icon: '📍', type: 'location' },
    { id: '3', text: '巴黎', subText: '法国浪漫之都', icon: '📍', type: 'location' },
    { id: '4', text: '大阪', subText: '日本美食之都', icon: '📍', type: 'location' },
    { id: '5', text: '首尔', subText: '韩国文化中心', icon: '📍', type: 'location' },
    
    // 美食推荐
    { id: '6', text: '寿司', subText: '日本传统美食', icon: '🍽️', type: 'food' },
    { id: '7', text: '拉面', subText: '日式面食文化', icon: '🍜', type: 'food' },
    { id: '8', text: '火锅', subText: '地道美食体验', icon: '🍲', type: 'food' },
    { id: '9', text: '泰式料理', subText: '独特风味美食', icon: '🥘', type: 'food' },
    
    // 热门活动
    { id: '10', text: '迪士尼乐园', subText: '主题乐园体验', icon: '🎡', type: 'activity' },
    { id: '11', text: '环球影城', subText: '娱乐主题公园', icon: '🎢', type: 'activity' },
    { id: '12', text: '富士山', subText: '自然景观探索', icon: '⛰️', type: 'activity' }
  ]
  
  // ���理输入变化
  const handleInput = (e: any) => {
    const value = e.detail.value
    dispatch(setKeyword(value))
    dispatch(setSearchActive(!!value))
    
    if (value) {
      dispatch(setSuggestions(mockSuggestions.filter(item => 
        item.text.toLowerCase().includes(value.toLowerCase())
      )))
    } else {
      dispatch(setSuggestions([]))
    }
  }

  // 处理建议项点击
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    dispatch(setKeyword(suggestion.text))
    dispatch(setSearchActive(false))
    dispatch(setSuggestions([]))
    Taro.navigateTo({
      url: `/pages/search-result/index?keyword=${encodeURIComponent(suggestion.text)}`
    })
  }

  // 处理搜索提交
  const handleSearch = () => {
    if (keyword.trim()) {
      dispatch(setSearchActive(false))
      dispatch(setSuggestions([]))
      Taro.navigateTo({
        url: `/pages/search-result/index?keyword=${encodeURIComponent(keyword.trim())}`
      })
    }
  }

  // 处理回车搜索
  const handleConfirm = () => {
    handleSearch()
  }

  // 处理搜索框聚焦
  const handleFocus = () => {
    dispatch(setSearchActive(true))
    dispatch(setSuggestions(mockSuggestions))
  }

  const suggestionItemStyle: React.CSSProperties = {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#ffffff',
  }

  return (
    <>
      <View className='search-container' style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: `${statusBarHeight}px`,
        paddingBottom: '8px',
        background: '#FFFAF0',
        zIndex: 100,
        borderBottomLeftRadius: isSearchActive ? 0 : '24px',
        borderBottomRightRadius: isSearchActive ? 0 : '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        borderBottom: isSearchActive ? 'none' : '2px solid #2D2D2D'
      }}>
        <View style={{
          height: `${menuButtonInfo.height}px`,
          display: 'flex',
          alignItems: 'center',
          marginRight: `${windowInfo.windowWidth - menuButtonInfo.left}px`,
          padding: '0 16px',
          marginTop: `${Math.max(4, menuButtonPadding)}px`
        }}>
          <View 
            style={{
              flex: 1,
              height: '36px',
              background: '#FFFFFF',
              borderRadius: '18px',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '2px solid #2D2D2D'
            }}
          >
            <View 
              onClick={handleSearch}
              style={{ 
                color: '#2D2D2D',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <IconFont fontClassName="iconfont" classPrefix="icon" name="RectangleCopy" size={16} />
            </View>
            <Input
              style={{ 
                flex: 1,
                color: '#333',
                fontSize: '14px',
                fontFamily: '"Hiragino Kaku Gothic ProN", sans-serif'
              }}
              value={keyword}
              onInput={handleInput}
              onConfirm={handleConfirm}
              onFocus={handleFocus}
              placeholder='搜索目的地、美食、攻略...'
              placeholderStyle='color: #666'
              confirmType='search'
            />
            {isSearchActive && (
              <View
                onClick={() => {
                  dispatch(setKeyword(''));
                  dispatch(setSearchActive(false));
                  dispatch(setSuggestions([]));
                }}
                style={{
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: '#999',
                  borderRadius: '50%',
                  background: '#F5F5F5',
                  cursor: 'pointer'
                }}
              >
                ✕
              </View>
            )}
          </View>
        </View>

        {/* 修改搜索建议下拉框部分 */}
        {isSearchActive && (
          <View className='suggestions-container' style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#FFFAF0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
            padding: '12px',
            maxHeight: '40vh',
            overflowY: 'auto'
          }}>
            <View>
              <View style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px'
              }}>
                热门目的地
              </View>
              {mockSuggestions
                .filter(item => item.type === 'location')
                .map(suggestion => (
                  <View
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      padding: '8px',
                      marginBottom: '8px',
                      background: '#FFF',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <View style={{ 
                      fontSize: '20px',
                      width: '40px',
                      height: '40px',
                      background: '#FFF0F5',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {suggestion.icon}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ 
                        fontSize: '14px',
                        color: '#333333',
                        marginBottom: '2px',
                        fontWeight: '500'
                      }}>
                        {suggestion.text}
                      </View>
                      <View style={{ 
                        fontSize: '12px',
                        color: '#666666'
                      }}>
                        {suggestion.subText}
                      </View>
                    </View>
                  </View>
                ))}
            </View>

            {/* 食推荐部分 */}
            <View style={{ marginTop: '16px' }}>
              <View style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px'
              }}>
                美食推荐
              </View>
              {mockSuggestions
                .filter(item => item.type === 'food')
                .map(suggestion => (
                  <View
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      padding: '8px',
                      marginBottom: '8px',
                      background: '#FFF',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <View style={{ 
                      fontSize: '20px',
                      width: '40px',
                      height: '40px',
                      background: '#FFF0F5',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {suggestion.icon}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ 
                        fontSize: '14px',
                        color: '#333333',
                        marginBottom: '2px',
                        fontWeight: '500'
                      }}>
                        {suggestion.text}
                      </View>
                      <View style={{ 
                        fontSize: '12px',
                        color: '#666666'
                      }}>
                        {suggestion.subText}
                      </View>
                    </View>
                  </View>
                ))}
            </View>

            {/* 热门活动部分 */}
            <View style={{ marginTop: '16px' }}>
              <View style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '8px'
              }}>
                热门活动
              </View>
              {mockSuggestions
                .filter(item => item.type === 'activity')
                .map(suggestion => (
                  <View
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      padding: '8px',
                      marginBottom: '8px',
                      background: '#FFF',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <View style={{ 
                      fontSize: '20px',
                      width: '40px',
                      height: '40px',
                      background: '#FFF0F5',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {suggestion.icon}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ 
                        fontSize: '14px',
                        color: '#333333',
                        marginBottom: '2px',
                        fontWeight: '500'
                      }}>
                        {suggestion.text}
                      </View>
                      <View style={{ 
                        fontSize: '12px',
                        color: '#666666'
                      }}>
                        {suggestion.subText}
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}
      </View>

      {/* 遮罩层 */}
      {isSearchActive && (
        <View
          onClick={() => {
            dispatch(setSearchActive(false))
            dispatch(setSuggestions([]))
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 90
          }}
        />
      )}
    </>
  )
}

// 添加跳转函数
const handleNavigateToDetail = (pointId: string) => {
  Taro.navigateTo({
    url: `../post-detail/index?id=${pointId}`
  })
}

// 在现有代码中添加搜索跳转方法
const handleSearch = (keyword: string) => {
  Taro.navigateTo({
    url: `/pages/search/index?keyword=${encodeURIComponent(keyword)}`
  })
}

// 修改导航函数
const handleNavigateToMine = () => {
  Taro.navigateTo({
    url: '../mine/index'
  })
}

// 分类数据移到组部
export default function Index() {
  // 分类数据
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'food', name: '美食' },
    { id: 'coffee', name: '咖啡' },
    { id: 'shopping', name: '购物' },
    { id: 'entertainment', name: '娱乐' },
    { id: 'sightseeing', name: '观光' },
    { id: 'nightlife', name: '夜生活' },
    { id: 'culture', name: '文化' },
    { id: 'sports', name: '运动' },
    { id: 'nature', name: '自然' },
  ]

  // 状态定义
  const [activeCategory, setActiveCategory] = useState('all')
  const [location, setLocation] = useState<Location>({
    latitude: 39.908775,
    longitude: 116.406315
  })
  const [panelHeight, setPanelHeight] = useState(30)
  const [startY, setStartY] = useState(0)
  const [moving, setMoving] = useState(false)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [loading, setLoading] = useState(true)
  const [nearbyPoints, setNearbyPoints] = useState<BusinessPoint[]>([])

  // 添加窗口信息状态
  const [windowInfo] = useState(() => Taro.getWindowInfo())
  const [menuButtonInfo] = useState(() => Taro.getMenuButtonBoundingClientRect())

  // 添加触摸事件处理函数
  const handleTouchStart = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setStartY(e.touches[0].clientY)
    setMoving(true)
  }

  const handleTouchMove = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!moving) return
    
    const currentY = e.touches[0].clientY
    const diff = startY - currentY
    const windowHeight = windowInfo.windowHeight
    
    let newHeight = panelHeight + (diff / windowHeight * 100)
    newHeight = Math.max(20, Math.min(80, newHeight))
    
    setPanelHeight(newHeight)
    setStartY(currentY)
  }

  const handleTouchEnd = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setMoving(false)
  }

  // 获取位置信息并更新附近发布点
  const getCurrentLocation = async () => {
    try {
      setLoading(true)
      const res = await Taro.getLocation({
        type: 'gcj02',
        isHighAccuracy: true
      })
      
      setLocation({
        latitude: res.latitude,
        longitude: res.longitude
      })
      
      // 生成并设置附近的标记点
      const nearbyMarkers = generateNearbyMarkers(res.latitude, res.longitude)
      setMarkers(nearbyMarkers)

      // 更新附近发布点数据
      const updatedNearbyPoints: BusinessPoint[] = nearbyMarkers.map((marker, index) => ({
        id: `${index + 1}`,
        name: marker.callout?.content || '',
        address: `地址示例 ${index + 1}`,
        distance: `${Math.floor(Math.random() * 1000)}m`,
        type: '咖啡店', // 示例类型
        rating: Math.random() * 5,
        reviewCount: Math.floor(Math.random() * 1000),
        timeSlots: ['10:00-22:00'],
        latitude: marker.latitude,
        longitude: marker.longitude
      }));

      // 更新状态显示新的附近发布点
      setNearbyPoints(updatedNearbyPoints)

    } catch (error) {
      console.error('获取定位失败:', error); // 印错误信息
      Taro.showToast({
        title: '定位失败，请检查权限和网络',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 点击处理函数
  const handleItemClick = (point: BusinessPoint) => {
    // 更新当前选中的 location
    setLocation({
      latitude: point.latitude,
      longitude: point.longitude
    });
  }

  // 添加发布页面转函数
  const handleNavigateToPost = () => {
    Taro.navigateTo({
      url: '../post/index'
    })
  }

  // 添加初始化定位
  useEffect(() => {
    getCurrentLocation()
  }, [])

  // 添加分享方法
  Taro.useShareAppMessage(() => {
    return {
      title: '发现身边好去处',
      path: '/pages/index/index',
      imageUrl: 'https://example.com/share-image.jpg' // 替换为实际的分享图片
    }
  })

  // 添加分享到朋友圈
  Taro.useShareTimeline(() => {
    return {
      title: '发现身边好去处',
      query: '',
      imageUrl: 'https://example.com/share-image.jpg' // 替换为实际的分享图片
    }
  })

  return (
    <View className='index' style={{ background: '#FFFAF0' }}>
      {loading ? (
        <View style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFAF0',
          fontFamily: '"Hiragino Kaku Gothic ProN", sans-serif'
        }}>
          <View style={{ 
            color: '#2D2D2D',
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '12px 24px',
            borderRadius: '24px',
            background: '#FFFFFF',
            border: '2px solid #2D2D2D'
          }}>定位中...</View>
        </View>
      ) : (
        <Map
          style='width: 100%; height: 100vh'
          latitude={location.latitude}
          longitude={location.longitude}
          markers={markers}
          scale={16}
          showLocation
          onError={() => {
            Taro.showToast({
              title: '地图加载失败',
              icon: 'none'
            })
          }}
        />
      )}
      
      <SearchBar />
      
      {/* 修改发布按钮为我的按钮 */}
      <View 
        onClick={handleNavigateToMine}
        style={{
          position: 'fixed',
          right: '20px',
          top: `${(windowInfo?.statusBarHeight || 20) + 120}px`,
          width: '48px',
          height: '48px',
          background: '#FFFFFF',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #2D2D2D',
          zIndex: 89,
          transition: 'all 0.2s ease'
        }}
      >
        <View style={{ 
          fontSize: '24px', 
          color: '#2D2D2D',
          // paddingTop: '5px',
          lineHeight: 1
        }}>
         <IconFont fontClassName="iconfont" classPrefix="icon" name="/assets/images/account.png" size={28} />
        </View>
      </View>

      <View 
        className='floating-panel' 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#FFFAF0',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          border: '2px solid #2D2D2D',
          borderBottom: 'none',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.08)',
          height: `${panelHeight}%`,
          transition: moving ? 'none' : 'height 0.3s ease-out',
          zIndex: 99
        }}
 
      >
        <View 
          catchMove
          className='panel-header'
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            textAlign: 'center',
            padding: '8px 0',
            position: 'relative',
            touchAction: 'none',
            userSelect: 'none'
          }}
        >
          <View 
            style={{
              width: '40px',
              height: '4px',
              background: '#ddd',
              borderRadius: '2px',
              margin: '0 auto'
            }}
          />
          
          {/* 分类栏放在 panel-header 中 */}
          <ScrollView
            scrollX
            style={{
              whiteSpace: 'nowrap',
              padding: '12px 16px',
              borderBottom: '1px solid #EAEAEA'
            }}
          >
            {categories.map(category => (
              <View
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  fontSize: '14px',
                  color: activeCategory === category.id ? '#FF4B4B' : '#666666',
                  background: activeCategory === category.id ? '#FFF0F0' : 'transparent',
                  borderRadius: '16px',
                  transition: 'all 0.2s ease',
                  minWidth: '40px',
                  maxWidth: '60px',
                  textAlign: 'center',
                  marginRight: '8px'
                }}
              >
                {category.name}
              </View>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          scrollY
          style={{
            height: `calc(100% - ${panelHeight * 0.3}px)`
          }}
        >
          {/* 使用 useState 管理的 nearbyPoints */}
          {nearbyPoints
            .filter(point => activeCategory === 'all' || 
              (activeCategory === 'food' && point.type === '火锅店') ||
              (activeCategory === 'coffee' && point.type === '咖啡店') ||
              (activeCategory === 'shopping' && point.type === '服装店')
            )
            .map((point) => (
              <View 
                key={point.id}
                onClick={() => handleItemClick(point)} // 点击整个列表项时更新 location
                style={{
                  padding: '12px',
                  margin: '8px 16px',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                {/* 标题行 */}
                <View 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}
                >
                  <View 
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡，避免触发列表项的 location 更新
                      Taro.navigateTo({
                        url: `../post-detail/index?id=${point.id}`
                      });
                    }}
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#2D2D2D'
                    }}
                  >
                    {point.name}
                  </View>
                  {/* 定位图标 */}
                  <View 
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      // 使用 Taro.openLocation 打开地图
                      Taro.openLocation({
                        latitude: point.latitude,
                        longitude: point.longitude,
                        name: point.name,
                        address: point.address
                      });
                    }}
                    style={{
                      fontSize: '20px',
                      cursor: 'pointer',
                      marginRight: '4px'
                    }}
                  >
                    <IconFont fontClassName="iconfont" classPrefix="icon" name="dingwei" size={28} />
                  </View>
                </View>

                {/* 标签行 */}
                <View style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '8px',
                  flexWrap: 'wrap'
                }}>
                  <View style={{
                    fontSize: '12px',
                    color: '#2D2D2D',
                    background: '#FFE4CC',
                    padding: '4px 8px',
                    borderRadius: '8px'
                  }}>
                    {point.type}
                  </View>
                  <View style={{
                    fontSize: '12px',
                    color: '#2D2D2D',
                    background: '#E8F4FF',
                    padding: '4px 8px',
                    borderRadius: '8px'
                  }}>
                    {point.distance}
                  </View>
                  {point.timeSlots.map((timeSlot, idx) => (
                    <View 
                      key={idx}
                      style={{
                        fontSize: '12px',
                        color: '#2D2D2D',
                        background: '#F0FFF0',
                        padding: '4px 8px',
                        borderRadius: '8px'
                      }}
                    >
                      {timeSlot}
                    </View>
                  ))}
                </View>

                {/* 地址 */}
                <View style={{
                  fontSize: '12px',
                  color: '#666',
                }}>
                  {point.address}
                </View>
              </View>
            ))}
        </ScrollView>
      </View>

      {/* 修改定位按钮的 zIndex */}
      <View 
        onClick={getCurrentLocation}
        style={{
          position: 'fixed',
          right: '20px',
          top: `${(windowInfo?.statusBarHeight || 20) + 120 + 68}px`,
          width: '48px',
          height: '48px',
          background: '#FFFFFF',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #2D2D2D',
          zIndex: 89,
          transition: 'all 0.2s ease'
        }}
      >
        <View style={{ 
          fontSize: '24px',
          lineHeight: 1
        }}>
          <IconFont fontClassName="iconfont" classPrefix="icon" name="a-appround25" size={28} />
        </View>
      </View>
    </View>
  )
}
