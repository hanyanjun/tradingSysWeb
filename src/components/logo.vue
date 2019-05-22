<template>
<div class="exchange">
    <template v-if="type == 'huobi'">
     <img :src="huobi" alt="">
    </template>
    <template v-else-if="type == 'bian'">
     <img :src="bian" alt="">
    </template>
    <template v-else-if="type == 'bitfinex'">
     <img :src="bitfinex" alt="">
    </template>
    <template v-else-if="type == 'bitmesh'">
     <img :src="bitmesh"  alt="">
    </template>
    <template v-else-if="type == 'kucoin'">
     <img :src="kucoin" alt="">
    </template>
    <template v-else-if="type == 'okex'">
     <img :src="okex" alt="">
    </template>
    <template v-else-if="type == 'poloniex'">
     <img :src="poloniex" alt="">
    </template>
    <template v-else-if="type == 'gateio'">
     <img :src="gateio" alt="">
    </template>
</div>
</template>

<script>
import huobi from "../assets/imgs/huobi_logo.png";
import bian from "../assets/imgs/bian_logo.png";
import gateio from "../assets/imgs/gateio_logo.png";
import bitfinex from "../assets/imgs/bitfinex_logo.png";
import bitmesh from "../assets/imgs/bitmesh_logo.png";
import kucoin from "../assets/imgs/kucoin_logo.png";
import okex from "../assets/imgs/okex_logo.png";
import poloniex from "../assets/imgs/poloniex_logo.png";
export default {
    name : 'logo',
    data(){return{
      huobi,
      bian,
      bitfinex,
      bitmesh,
      gateio,
      kucoin,
      okex,
      poloniex,
    }},
    props : {
        type : {
            typeof : String,
            default : ''
        }
    }
}
</script>

<style lang="scss" scoped>
.exchange{
    display: inline-block;
    img{
        display: inline-block;
        width: 20px;
        // height: 24px;
    }
}
</style>
