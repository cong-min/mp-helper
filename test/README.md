# MP Helper Test

### 测试单次编译

```bash
$ node bin/mp-helper.cli.js "test/input/**" test/output
```

### 测试监听编译

```bash
$ node bin/mp-helper.cli.js -w test/input test/output
```

### 测试使用配置文件

```bash
$ node bin/mp-helper.cli.js -c test/package.json
```
