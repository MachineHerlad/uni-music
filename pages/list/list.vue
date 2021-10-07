<template>
	<view class="list">
		<view class="fixbg" :style="{'background-image':'url('+playList.coverImgUrl+')'}"></view>
		<musicHead title="歌单" :isShow="true" color="white"></musicHead>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<view class="list-head">
					<view class="list-head-img">
						<image :src="playList.coverImgUrl"></image>
						<text class="iconfont icon-xiangyousanjiaoxing">{{playList.playCount | formatCount}}</text>
					</view>
					<view class="list-head-text">
						<view>{{playList.name}}</view>
						<view>
							<image :src="playList.creator.avatarUrl"></image>
							<text>{{playList.creator.nickname}}</text>
						</view>
						<view>{{playList.description}}</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="share" class="list-share">
					<text class="iconfont icon-changyong_sousuo"></text>分享给微信好友
				</button>
				<!-- #endif -->
				<view class="list-music">
					<view class="list-music-head">
						<text class="iconfont icon-a-changyong_zantingfuben"></text>
						<text>播放全部</text>
						<text>(共100首)</text>
					</view>
					<view class="list-music-item" 
					v-for="(item,index) in playList.tracks" 
					:key="index" 
					@tap="handleToDetail(item.id)">
						<view class="list-music-left">{{index+1}}</view>
						<view class="list-music-song">
							<view>{{item.name}}</view>
							<view>
							<image 
							v-if="privileges[index].flag > 0 && privileges[index].flag < 10" 
							src="../../static/only.png"></image>
							<image 
							v-if="privileges[index].maxbr ==999000"
							src="../../static/sq.png"></image>
							{{item.ar[0].name}} - {{item.name}}
							</view>	
						</view>
						<text class="iconfont icon-changyong_zanting"></text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	import musicHead from '../../components/musicHead/musicHead.vue'
	import {list} from '../../common/api.js'
	
	export default {
		data() {
			return {
				playList:{
					coverImgUrl:'',
					creator: {
						avatarUrl:''
					},
					trackCount: ''
				},
				privileges:[],
				isLoading:true
			}
		},
		components:{
			musicHead
		},
		onLoad(option) {
			uni.showLoading({
				title: '正在加载...',
				mask: false
			});
			
			list(option.listId).then((res) => {
				if(res[1].data.code =='200') {
					this.playList = res[1].data.playlist
					this.privileges = res[1].data.privileges
					// 提交歌单的歌曲
					this.$store.commit('INIT_TOPLISTIDS', res[1].data.playlist.trackIds)
					this.isLoading = false
					uni.hideLoading()
				}
			})
			
		},
		methods: {
			// 点击歌曲跳转到detail页面
			handleToDetail(songId) {
				uni.navigateTo({
					url: '../detail/detail?songId=' + songId,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style scoped>
	.list-head {
		display: flex;
		margin: 30rpx;
	}
	.list-head-img {
		width: 264rpx;
		height: 264rpx;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
		margin-right: 42rpx;
	}
	.list-head-img image {
		width: 100%;
		height: 100%;
	}
	.list-head-img text {
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		color: white;
		font-size: 26rpx;
	}
	.list-head-text {
		flex: 1;
		color: #f0f2f7;
	}
	.list-head-text view:nth-child(1) {color: white; font-size: 34rpx;}
	.list-head-text view:nth-child(2) {
		display: flex;
		margin: 20rpx 0;
		font-size: 24rpx;
	}
	.list-head-text view:nth-child(2) image {
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
		margin-right: 14rpx;
	}
	.list-head-text view:nth-child(3) {
		line-height: 34rpx;
		font-size: 22rpx
	}
	.list-share {
		width: 330rpx;
		height: 74rpx;
		margin: 0 auto;
		background: rgba(0,0,0,0.4);
		border-radius: 37rpx;
		color: white;
		line-height: 74rpx;
		font-size: 28rpx;
		text-align: center;
	}
	.list-share text {
		margin-right: 16rpx;
	}
	.list-music {
		width: 100%;
		background-color: #fff;
		border-radius: 15px 15px 0 0;
		overflow: hidden;
	}
	.list-music-head {
		width: 100%;
		height: 40px;
		line-height: 40px;
	}
	.list-music-head text:nth-child(1) {
		font-size: 18px; padding: 0 10px;
	}
	.list-music-head text:nth-child(2) {
		font-size: 14px; 
	}
	.list-music-head text:nth-child(3) {
		 font-size: 12px; color: rgba(0,0,0,.3)
	}
	.list-music-item {
		display: flex;
		margin: 0 32rpx 66rpx 46rpx;
		align-items: center;
		color: #959595;
	}
	.list-music-left {
		width: 58rpx;
		font-size: 30rpx;
		line-height: 30rpx;
	}
	.list-music-song {
		flex: 1;
	}
	.list-music-song view:nth-child(1){
		font-size: 28rpx;
		color: black;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.list-music-song view:nth-child(2){
		font-size: 20rpx;
		align-items: center;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.list-music-song view:nth-child(2) image{
		width: 32rpx;
		height: 20rpx;
		margin-right: 10rpx;
		flex-shrink: 0;
	}
	.list-musci-item text {
		font-size: 50rpx;
		color: #c7c7c7;
	}
</style>
