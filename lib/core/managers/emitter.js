import mitt from 'mitt';

const emitter = mitt(); // 全局实例

export default emitter;
export {
    mitt, // 创建实例的方法
};
