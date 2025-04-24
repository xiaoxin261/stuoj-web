<template>
    <div ref="editor" class="ace-editor"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, toRefs, onUnmounted } from 'vue';
import ace from 'brace';
import 'brace/mode/javascript'; // 根据需要加载其他语言模式
import 'brace/theme/monokai'; // 根据需要加载其他主题

const props = withDefaults(defineProps<{
    modelValue: string,
    mode?: string,
    theme?: string,
    options?: any,
}>(), {
    options: () => ({}),
    theme: 'monokai',
});

const emit = defineEmits(['update:modelValue']);

const { mode, theme, options } = toRefs(props);

const editor = ref(null);

onMounted(() => {
    const editorElement = editor.value as unknown as HTMLElement;
    const editorInstance = ace.edit(editorElement);
    editorInstance.getSession().setMode(`ace/mode/${mode.value}`);
    editorInstance.setTheme(`ace/theme/${theme.value}`);
    editorInstance.setOptions(options.value);
    editorInstance.setValue(props.modelValue);
    editorInstance.on('change', () => {
        const content = editorInstance.getValue();
        emit('update:modelValue', content);
    });

    // 添加括号自动补全功能
    editorInstance.on('change', (delta) => {
        // 仅在插入左括号时触发补全
        if (delta.action === 'insert' &&
            (delta.lines[0] === '(' || delta.lines[0] === '[' || delta.lines[0] === '{')) {
            const cursor = editorInstance.getCursorPosition();
            const session = editorInstance.getSession();
            const line = session.getLine(cursor.row);

            const closingChar = delta.lines[0] === '(' ? ')' :
                delta.lines[0] === '[' ? ']' : '}';
            // 检查后面是否已经有匹配的右括号
            if (cursor.column >= line.length || line.charAt(cursor.column) !== closingChar) {
                // 将光标移动到右括号位置
                const newCursor = {
                    row: cursor.row,
                    column: cursor.column + 1
                };
                session.insert(newCursor, closingChar);
                // 将光标移回左括号和右括号之间
                editorInstance.moveCursorTo(cursor.row, cursor.column);
            }
        }
    });
});

watch(theme, (newTheme) => {
    const editorInstance = ace.edit(editor.value as unknown as HTMLElement);
    editorInstance.setTheme(`ace/theme/${newTheme}`);
});

watch(mode, (newMode) => {
    const editorInstance = ace.edit(editor.value as unknown as HTMLElement);
    editorInstance.getSession().setMode(`ace/mode/${newMode}`);
});

onUnmounted(() => {
    const editorInstance = ace.edit(editor.value as unknown as HTMLElement);
    editorInstance.destroy();
});
</script>

<style scoped>
.ace-editor {
    height: 500px;
    width: 100%;
    font-size: 16px;
}
</style>