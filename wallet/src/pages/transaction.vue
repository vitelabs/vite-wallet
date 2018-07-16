<template>
    <div>
        <router-link :to="{ name: 'account', params: { id: 123 }}">{{ $t("hello") }}</router-link>
        <a 
            href="http://www.baidu.com" 
            target="_blank">baidu</a>
        <router-view/>
    </div>
</template>;
