<template>
    <div>
        <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        />
        <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
        />
    </div>
</template>

<script setup>
import { ref, reactive,inject,onMounted, onBeforeUnmount, shallowRef } from 'vue'
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';


// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const toolbarConfig = { excludeKeys:["uploadVideo"] } //去除上传视频功能
const editorConfig = { placeholder: '请输入内容...' }
const mode = ref("default")
const valueHtml = ref("")
// 图片上传地址配置
const server_url = inject("server_url")
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
    base64LimitSize: 10 * 1024, // 10kb
    server: server_url + "/upload/rich_editor_upload"
}
editorConfig.MENU_CONF['insertImage'] ={
    parseImageSrc:(src) =>{
        if(src.indexOf("http") !== 0){
            // 返回拼装了http的图片地址
            return `${server_url}${src}`
        }
        return src
    }
}

// 定义双向绑定的属性
const props = defineProps({
    modelValue:{
        type: String,
        default: ""
    }
})
// 定义数据传输事件
const emit = defineEmits(["update:model-value"])

// 设置初始文本默认值
let initFinished = false

// 数据加载时触发
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue;
        initFinished = true;
    }, 10);
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

const handleChange = (editor) => {
    if(initFinished){
        const text = editor.getText()
        // 文本修改时往父组件抛数据
        emit("update:model-value",text)
        // emit("update:model-value",'valueHtml.value')
    }
};
</script>

<style lang="scss" scoped>

</style>