/**
 * @file antd.config.js
 * @author BIFE
 * @description antd相关的配置
 */
import {Plugin} from 'vue';
import {
    Affix,
    BackTop,
    Breadcrumb,
    Button,
    Cascader,
    Checkbox,
    Collapse,
    DatePicker,
    Divider,
    Dropdown,
    Input,
    Menu,
    Modal,
    Select,
    Spin,
    Table,
    Tag,
    Tooltip,
    Tree,
    message,
    Radio,
    Form
} from 'ant-design-vue';
import scrollTo from 'ant-design-vue/lib/_util/scrollTo';

const antdInstall: Plugin = function (app) {
    app.use(Affix)
        .use(BackTop)
        .use(Breadcrumb)
        .use(Button)
        .use(Cascader)
        .use(Checkbox)
        .use(Collapse)
        .use(DatePicker)
        .use(Divider)
        .use(Dropdown)
        .use(Input)
        .use(Menu)
        .use(Modal)
        .use(Select)
        .use(Spin)
        .use(Table)
        .use(Tag)
        .use(Tooltip)
        .use(Tree)
        .use(Radio)
        .use(Form);
    app.config.globalProperties.$message = message;
    app.config.globalProperties.$scrollTo = scrollTo;
    app.config.globalProperties.$confirm = Modal.confirm;
};
export default antdInstall;
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $message: typeof message;
        $scrollTo: typeof scrollTo;
        $confirm: typeof Modal['confirm'];
    }
}
