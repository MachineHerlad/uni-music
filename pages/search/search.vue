<template>
	<view class="search">
		<musicHead title="搜索" :isShow="true" :iconblack="true"></musicHead>
		<view class="container" >
			<view class="search-search">
				<text class="iconfont icon-changyong_sousuo"></text>
				<input type="text" 
				placeholder="搜索歌曲" 
				v-model="searchWord" 
				@confirm="searchHotWord(searchWord)" 
				@input="handleToSuggest"/>
				<text class="iconfont icon-changyong_guanbi"  
				v-show="searchType !=1" @tap="closeResult"></text>
			</view>
			<scroll-view scroll-y="true">
				<block v-if="searchType == 1">
				<view class="search-history">
					<view class="search-history-head">
						<text>历史记录</text>
						<text class="iconfont icon-lajitong" @tap="clearHistory"></text>
					</view>
					<view class="search-history-list">
						<view v-for="(item,index) in searchHistory" :key="index" 
					@tap="changeHotWord(item)">{{ item }}</view>
					</view>
				</view>
				<view class="search-hot">
				<view class="search-hot-head">热搜榜</view>
				<view class="search-hot-item" 
				v-for="(item,index) in searchHot" 
				:key="index" @tap="changeHotWord(item.searchWord)">
					<view class="search-hot-top">{{index+1}}</view>
					<view class="search-hot-word">
						<view>
						{{ item.searchWord }} <image :src="item.iconUrl" mode="aspectFit"></image>
						</view>
						<view>{{ item.content }}</view>
					</view>
					<view class="search-hot-count">
						<text>{{ item.score }}</text>
					</view>
				</view>
				</view>
				</block>
				<block v-else-if="searchType == 2">
					<view class="search-result">
						<view class="search-result-item" 
						v-for="(item,index) in searchList" 
						:key="index" @tap="navToDetail(item.id)">
							<view class="search-result-word">
								<view>{{ item.name }}</view>
								<view>{{ item.artists[0].name }} - {{ item.album.name }}</view>
							</view>
							<text class="iconfont icon-changyong_zanting"></text>
						</view>
					</view>
				</block>
				<block v-else-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-head">搜索“{{searchWord}}”</view>
						<view class="search-suggest-item" v-for="(item,index) in searchSuggest" 
						:key = "index" @tap="changeHotWord(item.keyword)">
							<text class="iconfont icon-changyong_sousuo"></text>{{item.keyword}}
						</view>
					</view>
					
				</block>
			</scroll-view>
		</view>
			
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	import musicHead from '../../components/musicHead/musicHead.vue'
	import {searchHot, searchSuggest, searchWord} from '../../common/api.js'
	
	
	export default {
		data() {
			return {
				searchHot:[],
				searchWord:'',
				searchHistory:[],
				// 决定搜索框下面应该显示什么内容
				searchType:3,
				searchList:[],
				searchSuggest:[]
			}
		},
		onLoad() {
			searchHot().then(res => {
				if(res[1].data.code == '200') {
					this.searchHot = res[1].data.data
				}
			})
			// 从缓存中获取历史搜索记录
			uni.getStorage({
				key:'searchHistory',
				success: (res) => {
					this.searchHistory = res.data
				}
			})
			
		},
		onShow() {
			this.searchType = 1
		},
		components: {
			musicHead
		},
		methods: {
			// 改变搜索框上的文字,并调用搜索方法
			changeHotWord(word) {
				this.searchWord = word
				this.searchHotWord(word)
			},
			// 输入框按下回车后,进行搜索
			searchHotWord(word) {
				this.searchHistory.unshift(word)
				this.searchHistory = [...new Set(this.searchHistory)]
				if(this.searchHistory.length > 10) {
					this.searchHistory.length = 10
				}
				uni.setStorage({
					key:'searchHistory',
					data:this.searchHistory,
					success: () => {
						
					}
				})
				this.getSearchList(word)
			},
			// 清除历史记录
			clearHistory() {
				uni.clearStorage({
					key:'searchHistory',
					success:(res) => {
						this.searchHistory = []
					}
				})
			},
			// 获取搜索后的信息
			getSearchList(word) {
				
				searchWord(word).then(res => {
					if(res[1].data.code == '200') {
						this.searchList = res[1].data.result.songs
						this.searchType = 2
					}
				})
			},
			// 清空搜索框
			closeResult() {
				this.searchWord = ''
				this.searchType = 1
			},
			// 点击搜索到的歌曲时,跳转到detail页面
			navToDetail(songId) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + songId

				});
			},
			// 当搜索框输入内容时,搜索相关内容
			handleToSuggest(event) {
				let value = event.detail.value
				if(!value) {
					this.searchType = 1
					return
				}
			searchSuggest(value).then(res => {
					if(res[1].data.code == '200') {
						this.searchSuggest = res[1].data.result.allMatch
						this.searchType = 3
					}
				})
			}
			
		}
	}
</script>

<style scoped>
.search-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 50rpx 30rpx;
		background-color: #f7f7f7;border-radius: 50rpx;
	}
	.search-search text {
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}
	.search-search input {
		font-size: 28rpx;
		flex:1;
	}
	.search-history {
		margin: 0 30rpx 50rpx 30rpx;
		font-size: 26rpx;
	}
	.search-history-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 36rpx;
	}
	.search-history-list {
		display: flex;
		flex-wrap: wrap;
	}
	.search-history-list view {
		padding: 16rpx 28rpx;
		border-radius: 40rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		background-color: #f7f7f7
	}
	.search-hot{
		margin: 0 30rpx;
		font-size: 26rpx;
	}
	.search-hot-head {
		margin-bottom: 36rpx;
	}
	.search-hot-item {
		display: flex;
		align-items: center;
		margin-bottom: 58rpx;
	}
	.search-hot-top {
		color:#fb2222;
		width: 60rpx;
		margin-left: 8rpx;
	}
	.search-hot-word {
		flex: 1;
		
	}
	.search-hot-word view:nth-child(1) {
		font-size: 30rpx;
		color: black;
	}
	.search-hot-word view:nth-child(2) {
		font-size: 24rpx;
		color: #878787;
		width: 60vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.search-hot-word image {
		width: 48rpx;
		height: 22rpx;
	}
	.search-hot-count {
		color: #878787;
	}
	.search-result {
		border-top: 2rpx solid #e4e4e4;
		padding: 30rpx;
	}
	.search-result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 30rpx;
		border-bottom: 2rpx solid #e4e4e4;
	}
	.search-result-word {
		
	}
	.search-result-word view:nth-child(1) {
		font-size: 28rpx;
		color: #235790;
		margin-bottom: 12rpx;
	}
	.search-result-word view:nth-child(2) {
		font-size: 22rpx;
		color: #898989
	}
	.search-result-item text {
		font-size: 50rpx;
	}
	.search-suggest {
		border-top: 2px solid #e4e4e4;
		padding: 30rpx;
		font-size: 26rpx;
	}
	.search-suggest-head {
		color: #4574a5;
		margin-bottom: 74rpx;
	}
	.search-suggest-item {
		color: #5d5d5d;
		margin-bottom: 74rpx;
	}
	.search-suggest-item text {
		color: #bdbdbd;
		margin-right: 26rpx;
		position: relative;
		top: 2rpx;
	}
</style>
