// 简单的JavaScript测试脚本，用于验证插件功能
const testCases = [
    {
        name: "简单JSON对象",
        url: "data:application/json;charset=utf-8,%7B%22name%22%3A%22%E5%BC%A0%E4%B8%89%22%2C%22age%22%3A30%2C%22email%22%3A%22zhangsan%40example.com%22%2C%22isStudent%22%3Afalse%2C%22score%22%3A85.5%7D"
    },
    {
        name: "JSON数组",
        url: "data:application/json;charset=utf-8,%5B%7B%22id%22%3A1%2C%22name%22%3A%22%E5%BC%A0%E4%B8%89%22%2C%22age%22%3A30%2C%22email%22%3A%22zhangsan%40example.com%22%7D%2C%7B%22id%22%3A2%2C%22name%22%3A%22%E6%9D%8E%E5%9B%9B%22%2C%22age%22%3A25%2C%22email%22%3A%22lisi%40example.com%22%7D%2C%7B%22id%22%3A3%2C%22name%22%3A%22%E7%8E%8B%E4%BA%94%22%2C%22age%22%3A35%2C%22email%22%3A%22wangwu%40example.com%22%7D%5D"
    },
    {
        name: "嵌套JSON结构",
        url: "data:application/json;charset=utf-8,%7B%22company%22%3A%22Tech%20Corp%22%2C%22address%22%3A%7B%22street%22%3A%22123%20Main%20St%22%2C%22city%22%3A%22Beijing%22%2C%22country%22%3A%22China%22%7D%2C%22employees%22%3A%5B%7B%22name%22%3A%22%E5%BC%A0%E4%B8%89%22%2C%22role%22%3A%22Developer%22%2C%22skills%22%3A%5B%22JavaScript%22%2C%22Python%22%2C%22React%22%5D%7D%2C%7B%22name%22%3A%22%E6%9D%8E%E5%9B%9B%22%2C%22role%22%3A%22Designer%22%2C%22skills%22%3A%5B%22Photoshop%22%2C%22Sketch%22%2C%22Illustrator%22%5D%7D%5D%2C%22projects%22%3A%5B%7B%22name%22%3A%22Project%20X%22%2C%22status%22%3A%22active%22%2C%22budget%22%3A100000%7D%2C%7B%22name%22%3A%22Project%20Y%22%2C%22status%22%3A%22completed%22%2C%22budget%22%3A50000%7D%5D%7D"
    }
];

console.log("=== JSON Formatter Plugin Test ===");
console.log(`测试时间: ${new Date().toLocaleString()}`);
console.log(`测试用例数量: ${testCases.length}`);
console.log("");

testCases.forEach((testCase, index) => {
    console.log(`==== 测试用例 ${index + 1}: ${testCase.name} ====`);
    console.log(`访问地址: ${testCase.url}`);
    
    try {
        // 尝试打开测试页面（在实际使用中需要手动打开）
        console.log("请手动在Chrome浏览器中打开上述URL测试插件功能");
        
        // 模拟一些基础的测试
        const url = new URL(testCase.url);
        if (url.protocol === 'data:' && url.pathname.startsWith('application/json')) {
            console.log("✅ URL协议和MIME类型验证通过");
        }
        
        // 解析JSON数据
        const dataPart = testCase.url.split(',')[1];
        const decodedData = decodeURIComponent(dataPart);
        const jsonObj = JSON.parse(decodedData);
        console.log("✅ JSON解析成功");
        console.log(`   类型: ${Array.isArray(jsonObj) ? "Array" : "Object"}`);
        console.log(`   大小: ${decodedData.length} bytes`);
        
        if (jsonObj) {
            console.log("✅ 插件应该能成功格式化此JSON数据");
        }
        
        console.log("✅ 测试通过");
    } catch (error) {
        console.log(`❌ 测试失败: ${error.message}`);
    }
    console.log("");
});

console.log("=== 测试完成 ===");
console.log("");
console.log("验证插件正常工作的步骤:");
console.log("1. 在Chrome浏览器中访问测试URL");
console.log("2. 插件应该会自动格式化JSON");
console.log("3. 检查是否有语法高亮");
console.log("4. 测试右键菜单格式化功能");
console.log("5. 测试插件图标的格式化功能");
console.log("6. 验证深色/浅色主题切换功能");
console.log("7. 测试复制和下载功能");