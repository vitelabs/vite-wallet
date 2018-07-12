<template>
    <div>
        <router-link :to="{ name: 'account'}">{{ $t("hello") }}</router-link>
        <router-view></router-view>
    </div>
</template>;
