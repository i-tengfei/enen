module.exports = function ( app ) {

    var markdown = require( '../../bower_components/marked' );
    
    var path = config.type === 'development' ? '/client/' + config.view + '/' : '/';

    app.get( '/', function( req, res ){

        res.render( 'index', {
            path: path + 'index'
        } );

    } );

    app.get( '/login', function( req, res ){

        res.render( 'login', {
            path: path + 'login'
        } );

    } );

    app.get( '/signup', function( req, res ){

        res.render( 'signup', {
            path: path + 'signup'
        } );

    } );

    app.get( '/:id', function( req, res ){

        res.render( 'article', {
            path: path + 'article',
            title: '这里是一条很长的测试标题',
            content: markdown.parse( [
                '# Markdown 语法简明手册',
                '',
                '### 1. 使用 \\* 和 ** 表示斜体和粗体',
                '',
                '示例：',
                '',
                '这是 *斜体*，这是 **粗体**。',
                '',
                '### 2. 使用 === 表示一级标题，使用 --- 表示二级标题',
                '',
                '示例：',
                '',
                '这是一个一级标题',
                '============================',
                '',
                '这是一个二级标题',
                '--------------------------------------------------',
                '',
                '### 这是一个三级标题',
                '',
                '你也可以选择在行首加井号表示不同级别的标题，例如：# H1, ## H2, ### H3。',
                '',
                '### 3. 使用 \\[描述\\](链接地址) 为文字增加外链接',
                '',
                '示例：',
                '',
                '这是去往 [本人博客](http://ghosertblog.github.com) 的链接。',
                '',
                '### 4. 在行末加两个空格表示换行',
                '',
                '示例：',
                '',
                '第一行(此行最右有两个看不见的空格)  ',
                '第二行',
                '',
                '### 5. 使用 *，+，- 表示无序列表',
                '',
                '示例：',
                '',
                '- 无序列表项 一',
                '- 无序列表项 二',
                '- 无序列表项 三',
                '',
                '### 6. 使用数字和点表示有序列表',
                '',
                '示例：',
                '',
                '1. 有序列表项 一',
                '2. 有序列表项 二',
                '3. 有序列表项 三',
                '',
                '### 7. 使用 > 表示文字引用',
                '',
                '示例：',
                '',
                '> 野火烧不尽，春风吹又生',
                '',
                '### 8. 使用 \\`代码\\` 表示行内代码块',
                '',
                '示例：',
                '',
                '让我们聊聊 `html`',
                '',
                '### 9.  使用 四个缩进空格 表示代码块',
                '',
                '示例：',
                '',
                '    这是一个代码块，此行左侧有四个不可见的空格',
                '',
                '### 10.  使用 !\\[描述\\](图片链接地址) 插入图像',
                '',
                '示例：',
                '',
                '![我的头像](http://tp3.sinaimg.cn/2204681022/180/5606968568/1)',
                '',
                '# Cmd 高阶语法手册',
                '',
                '### 1. 加强的代码块，支持四十一种编程语言的语法高亮的显示，行号显示',
                '',
                '非代码示例：',
                '',
                '```',
                '$ sudo apt-get install vim-gnome',
                '```',
                '',
                'Python 示例：',
                '',
                '```python',
                '@requires_authorization',
                'def somefunc(param1=\'\', param2=0):',
                '    \'\'\'A docstring\'\'\'',
                '    if param1 > param2: # interesting',
                '        print \'Greater\'',
                '    return (param2 - param1 + 1) or None',
                '',
                'class SomeClass:',
                '    pass',
                '',
                '>>> message = \'\'\'interpreter',
                '... prompt\'\'\'',
                '```',
                '',
                'JavaScript 示例：',
                '',
                '``` javascript',
                '/**',
                '* nth element in the fibonacci series.',
                '* @param n >= 0',
                '* @return the nth element, >= 0.',
                '*/',
                'function fib(n) {',
                '  var a = 1, b = 1;',
                '  var tmp;',
                '  while (--n >= 0) {',
                '    tmp = a;',
                '    a += b;',
                '    b = tmp;',
                '  }',
                '  return a;',
                '}',
                '',
                'document.write(fib(10));',
                '```',
                '',
                '### 2. 表格支持',
                '',
                '示例：',
                '',
                '| 项目        | 价格   |  数量  |',
                '| --------   | -----:  | :----:  |',
                '| 计算机     | $1600 |   5     |',
                '| 手机        |   $12   |   12   |',
                '| 管线        |    $1    |  234  |',
                '',
                '',
                '### 3. 定义型列表',
                '',
                '名词 1',
                ':   定义 1（左侧有一个可见的冒号和四个不可见的空格）',
                '',
                '代码块 2',
                ':   这是代码块的定义（左侧有一个可见的冒号和四个不可见的空格）',
                '',
                '        代码块（左侧有八个不可见的空格）'
            ].join( '\n' ) )
        } );

    } );

    app.get( config.admin, function( req, res ){

        res.render( 'admin', {
            path: path + 'admin'
        } );

    } );

};