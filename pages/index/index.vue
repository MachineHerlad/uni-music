<template>
	<view class="content">
		<musicHead title="网易云音乐" :isShow="false"></musicHead>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-changyong_sousuo"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>
				 <view class="skeleton" v-if="isShowLoad">
				        <m-for-skeleton
				        :avatarSize="200"
				        :row="3"
				        :loading="isShowLoad"
				        isarc='square'
						:titleStyle="{}"
				        v-for="(item,key) in 4"
				        :key="key">
				        </m-for-skeleton>
				        <button type="primary" @click="hide" size="mini">隐藏</button>
				    </view>
					
				<view class="index-list" v-else>
					<view class="index-list-item" v-for="(item, index) in topList" :key="index"
					@tap="handleToList(item.id)"
					>
						<view class="index-list-img" >
							<image :src="item.coverImgUrl" ></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<view v-for="(item, index) in item.tracks" :key="index">
								{{index + 1}}.{{item.first}} - {{item.second}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	import musicHead from '../../components/musicHead/musicHead.vue'
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	import {topList} from '../../common/api.js'
	
	export default {
		data() {
			return {
				title: 'Hello',
				topList:[],
				isShowLoad:true
			}
		},
		components:{
			musicHead,
			mForSkeleton
		},
		onLoad() {

			topList().then(res => {
				if(res.length) {
					this.topList = res
					setTimeout(()=> {
						this.isShowLoad = false
					},1000)
				}
			})
		},
		methods: {
			// 点击什么什么榜跳转到list页面
			handleToList(listId) {
				uni.navigateTo({
					url:'../list/list?listId='+listId
				})
			},
			// 点击搜索框，跳转到search页面
			handleToSearch() {
				uni.navigateTo({
					url: '../search/search',
					
				});
			}
		}
	}
</script>

<style>
	.index-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;border-radius: 50rpx;
	}
	.index-search text {
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}
	.index-search input {
		font-size: 28rpx;
		flex:1;
	}
	
	.index-list {
		margin: 0 30rpx;
	}
	.index-list-item {
		display: flex;
		margin-bottom: 34rpx;
	}
	.index-list-img {
		position: relative;
		width: 212rpx;
		height: 212rpx;
		border-radius: 30rpx;
		margin-right: 22rpx;
		overflow: hidden;
	}
	.index-list-img image {
		width: 100%;
		height: 100%;
	}
	.index-list-img text {
		position: absolute;
		bottom: 16rpx;
		left: 12rpx;
		color: white;
		font-size: 20rpx;
	}
	.index-list-text {
		font-size: 24rpx;
		line-height: 66rpx;
	}
</style>
