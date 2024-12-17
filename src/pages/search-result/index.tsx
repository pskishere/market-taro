import { View, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'

interface SearchResult {
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
  price: string
  tags: string[]
}

interface FilterOptions {
  type: string[]
  price: string[]
  rating: number | null
  distance: string | null
  sort: 'distance' | 'rating' | 'price'
}

export default function SearchResult() {
  const router = useRouter()
  const [systemInfo] = useState(() => Taro.getSystemInfoSync())
  const safeAreaTop = systemInfo?.safeArea?.top || 0
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<SearchResult[]>([])
  const [showFilter, setShowFilter] = useState(false)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: [],
    price: [],
    rating: null,
    distance: null,
    sort: 'distance'
  })
  const keyword = decodeURIComponent(router.params.keyword || '')

  // 添加下拉刷新状态
  const [refreshing, setRefreshing] = useState(false)

  // 添加分页相关状态
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // 模拟获取搜索结果
  useEffect(() => {
    loadInitialData()
  }, [keyword])

  // 加载初始数据
  const loadInitialData = () => {
    setLoading(true)
    setTimeout(() => {
      const mockResults: SearchResult[] = generateMockData(1)
      setResults(mockResults)
      setLoading(false)
      setPage(1)
      setHasMore(true)
    }, 1000)
  }

  // 生成模拟数据
  const generateMockData = (page: number): SearchResult[] => {
    const startIndex = (page - 1) * 10
    return Array(10).fill(0).map((_, index) => ({
      id: `${startIndex + index + 1}`,
      name: `星巴克咖啡(${startIndex + index + 1}号店)`,
      address: `北京市朝阳区示例地址${startIndex + index + 1}号`,
      distance: `${Math.floor(Math.random() * 5000)}m`,
      type: '咖啡店',
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 5000),
      timeSlots: ['10:00-22:00'],
      latitude: 39.908775 + Math.random() * 0.01,
      longitude: 116.406315 + Math.random() * 0.01,
      price: '¥30-50',
      tags: ['咖啡', '甜点', '安静']
    }))
  }

  // 处理加载更多
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    // 模拟加载延迟
    setTimeout(() => {
      const nextPage = page + 1
      const moreResults = generateMockData(nextPage)
      
      // 模拟数据到达上限
      if (nextPage >= 5) {
        setHasMore(false)
      }

      setResults(prev => [...prev, ...moreResults])
      setPage(nextPage)
      setLoadingMore(false)
    }, 1000)
  }

  // 处理滚动到底部
  const handleScrollToLower = () => {
    handleLoadMore()
  }

  // 过滤器选项
  const filterItems = {
    type: ['咖啡店', '餐厅', '甜品店', '茶饮店'],
    price: ['¥0-25', '¥25-50', '¥50-100', '¥100+'],
    rating: [4.5, 4.0, 3.5, 3.0],
    distance: ['500m内', '1km内', '3km内', '5km内'],
    sort: ['距离最近', '评分最高', '价格最低']
  }

  // 点击列表项
  const handleItemClick = (result: SearchResult) => {
    Taro.navigateTo({
      url: `../post-detail/index?id=${result.id}`
    })
  }

  // 打开地图导航
  const handleOpenLocation = (result: SearchResult, e: any) => {
    e.stopPropagation()
    Taro.openLocation({
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
      address: result.address
    })
  }

  // 应用筛选器
  const applyFilters = (results: SearchResult[]) => {
    return results.filter(result => {
      // 类型筛选
      if (filterOptions.type.length > 0 && !filterOptions.type.includes(result.type)) {
        return false
      }

      // 价格筛选
      if (filterOptions.price.length > 0 && !filterOptions.price.includes(result.price)) {
        return false
      }

      // 评分筛选
      if (filterOptions.rating && result.rating < filterOptions.rating) {
        return false
      }

      // 距离筛选
      if (filterOptions.distance) {
        const distance = parseInt(result.distance)
        switch (filterOptions.distance) {
          case '500m内':
            if (distance > 500) return false
            break
          case '1km内':
            if (distance > 1000) return false
            break
          case '3km内':
            if (distance > 3000) return false
            break
          case '5km内':
            if (distance > 5000) return false
            break
        }
      }

      return true
    }).sort((a, b) => {
      // 排序
      switch (filterOptions.sort) {
        case 'distance':
          return parseInt(a.distance) - parseInt(b.distance)
        case 'rating':
          return b.rating - a.rating
        case 'price':
          return parseInt(a.price.replace('¥', '')) - parseInt(b.price.replace('¥', ''))
        default:
          return 0
      }
    })
  }

  // 处理筛选结果
  const handleFilter = () => {
    setLoading(true)
    // 模拟筛选延迟
    setTimeout(() => {
      const filteredResults = applyFilters(results)
      setResults(filteredResults)
      setShowFilter(false)
      setLoading(false)
    }, 500)
  }

  // 重置筛选器
  const handleResetFilter = () => {
    setFilterOptions({
      type: [],
      price: [],
      rating: null,
      distance: null,
      sort: 'distance'
    })
  }

  // 渲染评分标签
  const renderRatingTag = (rating: number) => (
    <View style={{
      fontSize: '12px',
      color: '#2D2D2D',
      background: '#FFE4CC',
      padding: '4px 8px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      ⭐ {rating.toFixed(1)}
    </View>
  )

  // 渲染价格标签
  const renderPriceTag = (price: string) => (
    <View style={{
      fontSize: '12px',
      color: '#2D2D2D',
      background: '#E8F4FF',
      padding: '4px 8px',
      borderRadius: '8px'
    }}>
      {price}
    </View>
  )

  // 渲染过滤器抽屉
  const renderFilterDrawer = () => (
    <View style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '80%',
      background: '#FFFFFF',
      transform: showFilter ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease',
      zIndex: 1000,
      boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 抽屉标题 */}
      <View style={{
        padding: '16px',
        borderBottom: '1px solid #EAEAEA',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <View style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#2D2D2D'
        }}>
          筛选
        </View>
        <View 
          onClick={() => setShowFilter(false)}
          style={{
            padding: '4px 8px',
            fontSize: '14px',
            color: '#666'
          }}
        >
          关闭
        </View>
      </View>

      {/* 过滤器内容 */}
      <ScrollView 
        scrollY 
        style={{
          flex: 1,
          padding: '16px'
        }}
      >
        {/* 类型过滤 */}
        <View style={{ marginBottom: '24px' }}>
          <View style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2D2D2D',
            marginBottom: '12px'
          }}>
            类型
          </View>
          <View style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {filterItems.type.map(type => (
              <View
                key={type}
                onClick={() => {
                  setFilterOptions(prev => ({
                    ...prev,
                    type: prev.type.includes(type) 
                      ? prev.type.filter(t => t !== type)
                      : [...prev.type, type]
                  }))
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: '1.5px solid #2D2D2D',
                  background: filterOptions.type.includes(type) ? '#FFE4CC' : '#FFFFFF',
                  fontSize: '14px',
                  color: '#2D2D2D'
                }}
              >
                {type}
              </View>
            ))}
          </View>
        </View>

        {/* 价格过滤 */}
        <View style={{ marginBottom: '24px' }}>
          <View style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2D2D2D',
            marginBottom: '12px'
          }}>
            价格
          </View>
          <View style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {filterItems.price.map(price => (
              <View
                key={price}
                onClick={() => {
                  setFilterOptions(prev => ({
                    ...prev,
                    price: prev.price.includes(price)
                      ? prev.price.filter(p => p !== price)
                      : [...prev.price, price]
                  }))
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: '1.5px solid #2D2D2D',
                  background: filterOptions.price.includes(price) ? '#FFE4CC' : '#FFFFFF',
                  fontSize: '14px',
                  color: '#2D2D2D'
                }}
              >
                {price}
              </View>
            ))}
          </View>
        </View>

        {/* 评分过滤 */}
        <View style={{ marginBottom: '24px' }}>
          <View style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2D2D2D',
            marginBottom: '12px'
          }}>
            评分
          </View>
          <View style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {filterItems.rating.map(rating => (
              <View
                key={rating}
                onClick={() => {
                  setFilterOptions(prev => ({
                    ...prev,
                    rating: prev.rating === rating ? null : rating
                  }))
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: '1.5px solid #2D2D2D',
                  background: filterOptions.rating === rating ? '#FFE4CC' : '#FFFFFF',
                  fontSize: '14px',
                  color: '#2D2D2D'
                }}
              >
                {rating}分以上
              </View>
            ))}
          </View>
        </View>

        {/* 距离过滤 */}
        <View style={{ marginBottom: '24px' }}>
          <View style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2D2D2D',
            marginBottom: '12px'
          }}>
            距离
          </View>
          <View style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {filterItems.distance.map(distance => (
              <View
                key={distance}
                onClick={() => {
                  setFilterOptions(prev => ({
                    ...prev,
                    distance: prev.distance === distance ? null : distance
                  }))
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: '1.5px solid #2D2D2D',
                  background: filterOptions.distance === distance ? '#FFE4CC' : '#FFFFFF',
                  fontSize: '14px',
                  color: '#2D2D2D'
                }}
              >
                {distance}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={{
        padding: '16px',
        borderTop: '1px solid #EAEAEA',
        display: 'flex',
        gap: '12px'
      }}>
        <View
          onClick={handleResetFilter}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: '1.5px solid #2D2D2D',
            textAlign: 'center',
            fontSize: '14px',
            color: '#2D2D2D'
          }}
        >
          重置
        </View>
        <View
          onClick={handleFilter}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: '1.5px solid #2D2D2D',
            background: '#FF4B4B',
            textAlign: 'center',
            fontSize: '14px',
            color: '#FFFFFF'
          }}
        >
          确定
        </View>
      </View>
    </View>
  )

  // 处理下拉刷新
  const handleRefresh = () => {
    setRefreshing(true)
    // 模拟刷新数据
    setTimeout(() => {
      // 重新获取数据
      const mockResults: SearchResult[] = [
        {
          id: '1',
          name: '星巴克咖啡(三里屯店)',
          address: '北京市朝阳区三里屯太古里北区N1-12号',
          distance: '500m',
          type: '咖啡店',
          rating: 4.8,
          reviewCount: 2341,
          timeSlots: ['10:00-22:00'],
          latitude: 39.908775,
          longitude: 116.406315,
          price: '¥30-50',
          tags: ['咖啡', '甜点', '安静']
        },
        // ... 其他模拟数据
      ]
      setResults(mockResults)
      setRefreshing(false)
    }, 1000)
  }

  return (
    <View style={{
      background: '#FFFAF0',
      minHeight: '100vh'
    }}>
      {/* 顶部栏 */}
      <View style={{
        padding: '12px 16px',
        borderBottom: '1px solid #EAEAEA',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <View style={{
          fontSize: '14px',
          color: '#666'
        }}>
          搜索"{keyword}"的结果
        </View>
        <View
          onClick={() => setShowFilter(true)}
          style={{
            fontSize: '14px',
            color: '#2D2D2D',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          筛选 
          <View style={{ fontSize: '16px' }}>
            🔍
          </View>
        </View>
      </View>

      {/* 搜索结果列表 */}
      {loading ? (
        <View style={{
          padding: '24px',
          textAlign: 'center',
          color: '#666'
        }}>
          加载中...
        </View>
      ) : results.length > 0 ? (
        <ScrollView 
          scrollY
          refresherEnabled
          refresherTriggered={refreshing}
          onRefresherRefresh={handleRefresh}
          onScrollToLower={handleScrollToLower}
          style={{
            height: 'calc(100vh - 44px)' // 减去顶部栏高度
          }}
        >
          {results.map(result => (
            <View 
              key={result.id}
              onClick={() => handleItemClick(result)}
              style={{
                padding: '12px',
                margin: '8px 16px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '2px solid #2D2D2D'
              }}
            >
              {/* 标题行 */}
              <View style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <View style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#2D2D2D'
                }}>
                  {result.name}
                </View>
                {/* 定位图标 */}
                <View 
                  onClick={(e) => handleOpenLocation(result, e)}
                  style={{
                    fontSize: '20px',
                    color: '#FF4B4B',
                    cursor: 'pointer'
                  }}
                >
                  📍
                </View>
              </View>

              {/* 标签行 */}
              <View style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '8px',
                flexWrap: 'wrap'
              }}>
                {renderRatingTag(result.rating)}
                {renderPriceTag(result.price)}
                <View style={{
                  fontSize: '12px',
                  color: '#2D2D2D',
                  background: '#FFE4CC',
                  padding: '4px 8px',
                  borderRadius: '8px'
                }}>
                  {result.type}
                </View>
                <View style={{
                  fontSize: '12px',
                  color: '#2D2D2D',
                  background: '#E8F4FF',
                  padding: '4px 8px',
                  borderRadius: '8px'
                }}>
                  {result.distance}
                </View>
                {result.timeSlots.map((timeSlot, idx) => (
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
                {result.address}
              </View>
            </View>
          ))}

          {/* 底部加载状态 */}
          <View style={{
            padding: '16px',
            textAlign: 'center',
            color: '#666'
          }}>
            {loadingMore ? '加载中...' : hasMore ? '上拉加载更多' : '没有更多了'}
          </View>
        </ScrollView>
      ) : (
        <View style={{
          padding: '24px',
          textAlign: 'center',
          color: '#666'
        }}>
          暂无搜索结果
        </View>
      )}

      {/* 渲染过滤器抽屉 */}
      {renderFilterDrawer()}

      {/* 遮罩层 */}
      {showFilter && (
        <View
          onClick={() => setShowFilter(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999
          }}
        />
      )}
    </View>
  )
}

// 添加页面配置
definePageConfig({
  navigationBarTitleText: '搜索结果',
  navigationBarBackgroundColor: '#FFFAF0',
  navigationBarTextStyle: 'black',
  backgroundColor: '#FFFAF0',
  enablePullDownRefresh: false // 使用自定义下拉刷新
}) 