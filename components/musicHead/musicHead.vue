<template>
	<view class="music-head" :style="{color:color }">
		<view class="music-head-icon" v-if="isShow" :class="{iconIsblack:iconblack}">
			<text class="iconfont icon-changyong_fanhui" @tap="handleToBack"></text>|<text class="iconfont icon-shouye" 
			@tap="handleToHome"></text>
			
		</view>
			{{ title }}
	</view>
</template>

<script>
	export default {
		name:"musicHead",
		data() {
			return {
				
			};
		},
		props:['title', 'isShow', 'color', 'iconblack'],
		methods:{
			handleToBack() {
				uni.navigateBack()
			},
			handleToHome() {
				uni.navigateTo({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped>
.music-head {
	position: relative;
	width: 100%;
	height: 75px;
	font-size: 16px;
	line-height: 80px;
	text-align: center;
	color: black;
}
.music-head-icon {
	display: flex;
	position: absolute;
	top: 23px;
	left: 8px;
	width: 90px;
	height: 31px;
	line-height: 31px;
	background-color: rgba(0,0,0, .4);
	color: white;
	border-radius: 15px;
	justify-content: space-around;
}
.iconIsblack{
	color: black;
	border:1px solid #eaeaea;
	background: white;
 }
</style>
