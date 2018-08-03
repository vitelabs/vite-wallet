<template>
    <div v-show="pageList.length" class="pagination-wrapper">
        <span class="box" :class="{
            'unuse': currentPage <= 1
        }" @click="_toPage(currentPage - 1)">&lt;</span>

        <span v-for="(pageNumber, i) in pageList" :key="i"
              @click="_toPage(pageNumber)"
              class="box" :class="{
                  'active': pageNumber === currentPage,
                  'ellipsis': pageNumber === '...'
        }">{{ pageNumber }}</span>

        <span class="box" :class="{
            'unuse': currentPage >= totalPage
        }"  @click="_toPage(currentPage + 1)">&gt;</span>
    </div>
</template>

<script>
const ellipsis = '...';

export default {
    props: {
        currentPage: {
            type: Number,
            default: 1
        },
        totalPage: {
            type: Number,
            default: 0
        },
        maxPageNumber: {
            type: Number,
            default: 7
        },
        toPage: {
            type: Function,
            default: ()=>{}
        }
    },
    computed: {
        pageList() {
            if (!this.totalPage || !this.currentPage || !this.maxPageNumber) {
                return [];
            }

            let list = [1];
            let minNumber = this.currentPage - 2;
            let maxNumber = this.currentPage + 2;
            if (minNumber <= 1) {
                maxNumber += 2 - minNumber;
                minNumber = 2;
            }
            maxNumber = maxNumber > this.totalPage -1 ? this.totalPage -1 : maxNumber;
            if (maxNumber === this.totalPage -1) {
                minNumber = this.currentPage - (this.maxPageNumber - 2 - (this.totalPage - this.currentPage));
            }

            minNumber > 2 && list.push(ellipsis);
            for (let i=minNumber; i<=maxNumber; i++) {
                list.push(i);
            }
            maxNumber !== this.totalPage -1 && list.push(ellipsis);
            list.push(this.totalPage);

            return list;
        }
    },
    methods: {
        _toPage(pageNumber) {
            if (!pageNumber || pageNumber === ellipsis || 
                pageNumber < 1 || pageNumber > this.totalPage) {
                return;
            }
            this.toPage(pageNumber);
        }
    }
};
</script>

<style lang="scss" scoped>
.pagination-wrapper {
    width: 100%;
    text-align: center;
    .box {
        box-sizing: border-box;
        display: inline-block;
        width: 24px;
        height: 24px;
        border: 1px solid #C6CBD4;
        border-radius: 2px;
        line-height: 24px;
        font-size: 14px;
        color: #333;
        margin-left: 6px;
        &:first-child {
            margin-left: 0;
        }
        &.unuse {
            color: #999;
        }
        &.active {
            background: #195BDD;
            color: #fff;
            border: none;
        }
        &.ellipsis {
            border: none;
        }
    }
}
// .prev {
//     &:after {
//         content: '/E600';
//         display: inline-block;
//         width: 100%;
//         height: 100%;
//     }
// }
// .next {
//     &:after {
//         content: '/E604';
//         display: inline-block;
//     }
// }
</style>
