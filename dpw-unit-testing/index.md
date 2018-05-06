---
title: DPW UI Unit Testing
date: 2016-08-08 15:06:33
thumbnail: tdd_flow.gif
---

## 前言

JavaScript 是一种动态类型、基于原型的解释性语言，她拥有着强大而灵活的表达能力。而 Great power comes great responsibility，在没有类似静态编译语言的编译器协助的情况下，JavaScript 大型应用可能潜在着很大的风险。因此，AngularJS 团队认为为 JavaScript 构建的应用编写测试非常的重要，他们将 ***可测试性（testable）*** 作为 AngularJS 框架一个非常显著的特性。

AngularJS 框架为测试提供了很多特性，这些特性使得给 AngularJS 应用编写测试相当地简单。但第一次接触时可能会觉得无从入手，而一旦理解之后就会明白测试在 AngularJS 应用中其实十分的直白并有迹可循。

现在，让我们从 “启动应用（刷新页面），并手动检查一切功能正常工作” 的模式切换到 “有元测试覆盖心里更有底” 的模式吧。在此前提下，更多地关注业务逻辑、算法代码优化以及制作更为精美的 UI。

**Unit Testing 与 End-to-End Testing**

- **Unit Testing** 
    单元测试用于直接调用代码的某个单元实体（比如 Directive，Contronller 等），并测试此功能单元实体。通常一个测试套件对应一个功能实体，测试套件由一个或多个测试用例构成。在测试用例内部，我们构造数据并调用代码，并断言代码的实际的输出符合我们的预期。
- **End-to-End**
    E2E 测试模拟真实的用户，使用代码来模拟用户访问应用并做出某些操作（点击按钮、输入内容等）。举个简单的 E2E 测试例子：模拟用户访问应用首页，点击登录按钮，断言登陆成功时跳转到后台首页 `/dashboard`。目前在 DPW，E2E 测试主要由 Test Automation Team 负责。AngularJS 团队也提供了一个用于 E2E 测试的框架： [Protractor](http://www.protractortest.org)。

## 测试工具栈

AngularJS 框架让编写测试变得简单，但为了让整个测试过程可便捷地反复地之行，我们还需要一套工具集让将测试的执行过程尽量地简化。这套工具集包括 [Karma](https://karma-runner.github.io)，[Mocha](https://mochajs.org)，[Chai](http://chaijs.com) 以及 [Sinon](http://sinonjs.org)。

### [Karma](https://karma-runner.github.io)

Karma 是 AngularJS 团队出品的测试运行工具（***Test Runner***），目标在于简化建立测试环境的工作量。Karma 的特性之一是可以将代码放置在真实的设备上运行，可以指定多个运行环境，例如同时在 Google Chrome，Firefox 和 IE 浏览器上运行；另外一个特性是其测试框架无关性，这意味这你可以选择熟悉的测试框架（Mocha，Jasmine 或者 Qunit）；最后，Karma 与 IDE （例如 WebStorm） 和 持续集成系统（Jenkins）都可以方便的结合使用。

#### 安装 Karma

Karma 的运行环境是 [Node.js](https://nodejs.org)，Node.js 的版本要求在 0.10 之上。如果系统安装过 Node.js，即可在命令行中（项目目录下）运行以下命令来安装 karma 以及其命令行调用工具：

```shell
$ npm install --save-dev karma
```

这条命令指定 Karma 作为项目的开发依赖包，之后我们可以通过以下命令来调用：

```shell
$ ./node_modules/karma/bin/karma start
```

当需要多次使用时，通过调用 `node_modules` 目录下的文件会显得非常繁琐，我们可以安装 `karmar-cli` 来解决这个问题：

```shell
$ npm install -g karma-cli
```

`karma-cli` 提供了 `karma` 命令。执行 `karma` 命令将调用项目目录下的 `node_moules/karma` 来启动测试。

#### 配置 Karma

各个项目的组织方式不同，为了兼容不同的项目，Karma 需要一个配置文件来告诉她关于项目的信息。这些配置包括：待测试的源码文件以及测试代码、采用的测试框架和断言库、测试环境（浏览器）等信息。我们可以使用 `karma init` 命令来启动交互式的配置过程。例如，创建 `developer site` 的配置文件 ：

```shell
karam init developer.conf.js
```

Karma 配置文件示例：

```javascript
module.exports = function (config) {
  config.set({
    basePath: './',
    files: ['asserts/js/**/*.js'],
    frameworks: ['mocha', 'chai', 'sinon'],
    browsers: ['chrome'],
    reporters: ['mocha'],
    autoWatch: true
  });
};
```



关于更多配置的信息请参考 [Karma Configuration File](https://karma-runner.github.io/1.0/config/configuration-file.html)。

### [Mocha](https://mochajs.org)

Mocha 测试框架诞生于 2011 年，是目前最流行的 JavaScript 测试框架之一，在 浏览器 和 Node 环境中都可以使用。一份简单的 Mocha 测试文件的例子如下：

```javascript
var assert = require('assert');

describe('Array', function () {
  it('#indexOf', function () {
    assert.equal(-1, [1, 2, 3].indexOf(4));
  });
});
```

在这个例子中，`describe` 函数用于描述一个 **测试套件**，第一个参数是套件的名称，第二参数是一个实际执行的函数。`it` 函数描述具体的 **测试用例**，表示一个单独的测试；第一个参数是用例的名称，第二个参数是一个实际执行的函数。

> **注**： Mocha 基础知识可以参阅 [《测试框架 Mocha 实例教程》](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)。

### [Chai](http://chaijs.com)

**断言** 是指源码执行的结果与预期结果是否一致，如果不一直就抛出错误。由于 Mocha 并未内置断言功能，因此需要使用第三方断言库，我们使用的是 Chai。

Chai 是一个可应用于 浏览器 和 Node 环境的断言库，她提供了三种断言风格，即`Should`，`Expect` 以及 `Assert`。我们目前采用的是 `Expect` 风格，一个简单的例子：

```javascript
it('#indexOf', function () {
  expect([1, 2, 3].indexOf(4)).to.equal(-1);
};
```

### [Sinon](http://sinonjs.org/)

 Sinon 是一个 JavaScript 测试中用于 Spy，Stub 和 Mock 库。简单来说，Sinon 可以为测试提供 “测试替身”，替换不确定的依赖从而使测试变得简单。Sinon 将所谓的 “测试替身” 分为 3 种类型：

- Spies：可以提供函数调用的信息，但不会改变函数的行为
- Stubs：与 Spies 类似，但会完全替换掉目标函数。这使得我们可以用这个替身做任何想要的事情，例如返回特定的值。
- Mocks：通过组合 Spies 和 Stubs，替换一个完整的对象。

创建一个 Spy 的简单示例：

```javascript
var spy = sinon.spy()

// 可以像调用函数一样调用一个 spy
spy('Hello');

// 现在我们可以获取这次调用的信息
console.log(spy.firstCalls.args);
```

另一种场景是我们需要将一个对象的某个函数替换成一个 spy：

```javascript
var user = {
  setName: function (name) {
    this.name = name;
  }
}

// 为 SetName 方法创建一个 spy
var setNameSpy = sinon.spy(user, 'setName');

// 现在开始，每次调用这个方法是，相关信息都会被记录
user.setName('Vi');

// 查看 Spy 获取到的信息
console.log(setNameSpy.callCount);

// 最后，移除 spy
setNameSpy.restore()
```

## 编写测试之前

在 DPW 项目中，所有测试相关的文件都存放于 `WEB/test` 目录下。第一次使用时需要安装测试的 NPM 依赖包：在 `WEB/test` 目录下执行 `npm install` 来安装所需的依赖。

当依赖安装完成之后，即可运行 `npm run developer` 来执行测试。在 Windows 平台上也可以使用 `desktop.bat` 批处理文件来启动测试。除此之外，也可以集合 WebStorm IDE 来启动测试（推荐的方式），WebStorm 测试的配置请看下图:

<img alt="WebStorm Karma Configuration" class="full-image" src="/uploads/webstorm-karma-configuration.png" >

### 测试文件组织

单元测试文件存放于 `WEB/test/unit` 目录下，测试脚本支持 ES5 以及 [CoffeeScript](http://coffeescript.org/)，文件命名采用 `name.spec.js` (或 `name.spec.coffee`）的形式，并与待测试的脚本名字关联（若待测试的脚本所包含的内容比较多，可以使用目录的形式，目录中每一个文件对应待测试脚本的一个功能点）。

### JavaScript 与 CoffeeScript

通常测试文件包含大多数的 `describe` 和 `it`，每一个块都比较简短，而 `describe` 和 `it` 都是接收 `string` 和 `function` 的形式，这将导致测试脚本包含大量的括号 `()` 和 花括号 `{}`。而 CoffeeScript 非常适合用于这种场景，因此为了更快速简洁地编写测试脚本，推荐使用 CoffeeScript 作为主要的编写语言（编写测试仅需要很少的 CoffeeScript 的知识）。我们可以来对比下使用 JavaScript 和 CoffeeScript 编写的测试文件之间的差异：

使用 JavaScript 编写，可以看到里面包含着大量的符号：

```javascript
describe('Array', function () {
  it('#isArray', function () {
    expect(Array.isArray([1, 2])).to.equal true
  });
  it('#filter', function () {
    var actual = [1, 2].filter(function (item) {
      return item > 1;
    });
    expect(actual).to.deep.equal [2]
  });
});
```

同样的测试脚本使用 CoffeeScript 编写，代码显得十分整洁：

```coffeescript
describe 'Array', ->
  it '#isArray', ->
    expect(Array.isArray [1, 2]).to.equal true

  it '#filter', ->
    actual = [1, 2].filter -> item > 1
    expect(actual).to.deep.equal [2]  
```

项目内部已经有许多使用 CoffeeScript 编写的测试脚本，你可以将他们作为参考。在此之前，你或许需要了解 CoffeeScript 最基本的几点知识：

1. 变量定义不需要 `var`
1. 函数定义使用 `->` 代替 `function` 关键字
1. 函数调用时的括号时可以省略的


## 开始编写测试

AngularJS 应用的单元测试有一个特性就是：在测试代码之前，我们需要手动引用代码所属的模块（module）以及获取代码中所使用的依赖（DI）。幸运的是，AngularJS 提供了方便的方法让我们处理上述两个过程。

### 编写测试的 Pre-condition （必读）

我们将在这个章节介绍：“如何引用 module” 以及 “依赖的注入”，所有的测试脚本都将使用到这部分介绍的内容，所以本节 的内容是 **必读** 的。

#### Module 的引用

AngularJS 以 module 来组织应用，因此在执行测试之前需要引用 module。为了引用 module，我们需要使用到 AngularJS 提供的一个称为 [ngMock](https://docs.angularjs.org/api/ngMock) 的测试辅助 Module，此模块提供的 `angular.mock.module` 方法用于引入 module(s)。此方法注册了一个快捷方法在 `window` 全局空间里即：`window.module`：

```javascript
angular.mock.module('moduleName');

// 或者 
module('moduleName');
```

当我们需要测试一个放在 `dpw.components` module 下的实体时，使用以下语句来引入 `dpw.components` module：

```javascript
beforeEach( module('dpw.components') );
```

**注意：** 模块的引入必须在 `angular.mock.inject` 之前调用。


##### 关于 `angular.mock.module`


此方法主要用于收集 modules，这些 modules 将用于在每个测试用例之前创建 `$injector` 对象（即 DI 处理对象）。在测试不同的时期调用此方法，其执行结果不同：

1. 在 `beforeEach` 里调用，返回一个 `workFn`。
2. 在 `it` 里调用，执行 `workFn`。


#### 依赖的注入

AngularJS 应用在 [bootstrap](https://docs.angularjs.org/guide/bootstrap) 的过程中会自动创建一个 `$injector` 用于处理 DI。而在单元测试中，bootstrap 的过程并未被自动触发，也就说我们需要手动创建 `$injector`。

ngMock 提供了一个方法来处理依赖：`angular.mock.inject`。此方法与 `angular.mock.module` 相同，也在 `window` 全局空间下注册了一个快捷方法 `window.inject`。让我们先来看下如何使用 `inject` 方法注入依赖：

```javascript
// 声明一个局部变量
var $rootScope;

beforeEach(inject(function (_$rootScope_) {
  // 当依赖注入后，将获取到的依赖存储在 $rootScope 局部变量中
  // _$rootScope_ 是一个特殊的写法
  // AngularJS 会自动去除前后的 _ 去获取正确的 service
  $rootScope = _$rootScope_;
});
```

上述例子中，我们定义里一个局部变量 `$rootScope`。在依赖注入之后，将获取到的依赖 `_$rootScope_` 存储在这个局部变量中。

##### inject 的工作原理

`inject` 方法接收一个或多个函数（记为 `Fns`）作为参数，方法将调用 `angular.injector` 并使用 `angular.mock.module` 中配置的 modules（自动会添加上 ng, ngMock）来创建一个 `$injector`，然后调用 `$injector.invoke` 方法解析 `Fns` 中所需的依赖。

##### inject 的最佳实践

例子中出现了前后双下划线（ `_$rootScope_` ），这个是为了方便我们命名局部变量。AngularJS 在内部依赖的时候会自动将前后的下划线去掉，从而获取到正确的依赖。请参阅 [官方文档的说明](https://docs.angularjs.org/api/ngMock/function/angular.mock.inject#resolving-references-underscore-wrapping-)。如果，这种方式看起来比较别扭或者需要引用较多的依赖时，我们可以只获取 `$injector` 依赖，然后通过这个对象来获取所需的其它依赖：

```javascript
var $rootScope;

beforeEach(inject(function ($injector) {
  $rootScope = $injector.get('$rootScope');
  $location = $injector.get('$location');
  // 等等
}));
```

##### Filters 的注入

Filter 的注入有点特殊，因为注入的时候，我们需要在 filter 的名字后面加上 `Filter`。举个例子，假设有一个名为 `foo` 的 filter，他的注入形式如下（注意 `inject` 函数的参数名称）：

```coffeescript
describe 'Filter: foo', ->
  foo = null

  beforeEach module 'bar'
  beforeEach inject (fooFilter) ->
    foo = fooFilter

  it 'foo is always foo', ->
    expect(foo 'anything').to.equal 'foo'

```


##### 关于 `angular.mock.inject`

在 `beforeEach` 调用 `inject` 时返回一个函数（`fn`）。每一个测试用例执行前，`fn` 都会被执行并创建 `$injector`，传递给 `inject` 的函数将会被 `$injector.invoke` 调用，依赖便在此时注入；若在测试用例内部调用 `inject`，`fn` 将会被直接执行（`$injector` 已存在），依赖同样在此处理。

### 让我们开始吧

到目前为止，我们了解了编写单元测试所需要的一些前置条件的知识。接下来，就让我们来针对 AngularJS 的不同实体（Service，Filter，Directive，Controller）说明测试用例的编写方法。

**注意：** 以下示例测试代码将全部使用 CoffeeScript 编写。

### 测试 Services

Services 与 Filters 是最为容易的测试部分，因此我们先从测试 Services 开始。测试一个 service 之前，我们需要了解这个 service 属于哪个 module 并引入此 module；而后通过依赖注入来获取此 service。

以 `helpers` 为例，其位于 `dpw.services` module 里，定义如下：

```javascript
angular.module('dpw.services').factory('helpers', [function () {
  return { foo: 'bar' };
}]);
```

对应的测试脚本（`helpers.spec.coffee`）如下：

```coffeescript
describe 'Core Services', ->
  describe 'helpers', ->
    # 定义局部变量
    helpers = null

    # 引用 module
    beforeEach(module 'dpw.services')

    # 获取 helpers
    beforeEach inject ($injector) -> 
      helpers = $injector.get 'helpers'

    # 测试实例属性 foo
    it '#foo', ->
      expect(helpers.foo).to.equal 'bar'
```

### 测试 Filters

Filters 的测试与 Service 类似，先引用 module，而后注入依赖。我们直接看例子：

```coffeescript
describe 'ngFilters#XSRF_Protect', ->
  XSRFProtect = null
  $cookies = null

  beforeEach(module 'dpw.common')

  beforeEach inject (XSRFProtectFilter, _$cookies_) ->
    XSRFProtect = XSRFProtectFilter
    $cookies = _$cookies_
  
  afterEach ->
    $cookies.remove('XSRF-TOKEN')

  it 'Should return input if input is not a string', ->
    expect(XSRFProtect undefined).to.be.undefined

  it 'Should return input if XSRF-TOKEN cookie is not exist', ->
    expect(XSRFProtect 'foo').to.equal 'foo'

  it 'Should add token to the input', ->
    $cookies.put 'XSRF-TOKEN', 'bar'
    expect(XSRFProtect '/api/example').to.equal '/api/example?sctk=bar'
```

### 测试 Controllers

Controllers 的测试比 Services / Filters 的测试多加了一步，就是我们需要使用 `$controller` 去创建一个 Controller 的实例。在实例化 Controller 的过程，可能需要使用 `$rootScope` 来创建一个新的 scope；但若在 Controller 的内部没有使用到例如 `$watch`, `$apply` 等 scope 上的函数，使用一个对象字面量做为 scope 也可以。

我们先来看一下一个 Controller 测试代码的基本结构：

```coffeescript
describe 'DAG: Something Controller', ->
  $rootScope  = null
  $controller = null
  
# Someghint Controller 位于 `DAG.main` Module 里  
beforeEach module 'DAG.main'  
beforeEach inject ($injector) ->
  $rootScope  = $injector.get '$rootScope'
  $controller = $injector.get '$controller'
  
describe 'Something#foo', ->
  # 实例化一个 Something 的实例
  # $controller 接收两个参数：
  #   {String} - Controller 的名称
  #   {Object} - Local 数据，通常包含的是 $scope 
  $something = $controller 'Something', {$scope: $rootScope.$new() }
  
  expect($something.foo).to.equal 'foo'
```

#### Mock 异步请求

在 Controller 内部极有可能使用 `api` 这个 service 发起异步请求。当测试一个包含有异步请求的 Controller 时，我们通常希望可以 Mock 掉请求。在 AngularJS 中，我们可以使用被 ngMock 提供的 `$httpBackend` 来实现。

绝大多数情况下，我们将使用 `$httpBackend.when` 方法来拦截请求已经伪造返回数据。`when` 函数接收两个参数，第一个为请求的 HTTP Method，第二个是请求的地址，并返回一个 `requestHandler` 对象；接着，我们可以在这个 `requestHandler` 上调用 `response` 方法，响应请求并返回结果。例如：

```coffeescript
$httpBackend.when('GET', '/api/users').response 200, {}
```

在 ngMock 修改之前的 `$httpBackend` 会等待请求完成，然后返回结果给发起请求者，这个过程是异步的（因为各个请求的响应时间可能不同）。由于编写这种针对异步的测试代码较为繁琐，因此 ngMock 过的 `$httpBackend` 提供了一个称为 `flush` 的方法，这个方法响应请求（表示请求已完成）。

也就是说，当你使用 `$http` 发起一个异步请求后，你必须使用 `$httpBackend.flush` 方法。一个简单的例子如下：

```coffeescript
beforeEach ->
  $httpBackend.when('GET', '/api/user').response 200, {name: 'Vi'}
  
describe 'DAG: Something Controller', ->
  it '#foo', ->
    # Controller 内部有发起 API 请求
    $something = $controller 'Something', {$scope: $rootScope.$new()}
    
    # 响应请求
    $httpBackend.flush()
    
    expect($something.loaded).to.be.true
```

需要注意的是，有请求发生时，我们都必须使用 `flush` 方法来响应。我们需要使用 `$httpBackend` 的两个方法来确保请求都有被捕获并响应：

```coffeescript
afterEach ->
  $httpBackend.verifyNoOutstandingExpectation()
  $httpBackend.verifyNoOutstandingRequest()
```

### 测试 Directives

Directives 的测试实际上也非常的简单。引用 module 和 依赖注入这两个前置步骤依然需要，另外一个前置条件是 **模板的处理**。


#### Directive 的模板注入

在当前的项目中，我们将所有的模板都放置在一个 `_temlates.html` 文件中，然后直接作为页面内容注入到页面上去，但在测试中并未注入这个文件的内容到页面上。

为了解决这个问题，我加了一个 Karma 的 Pre-processor，用于获取 `_templates.html` 中定义的模板。这个 Pre-processor 会将所有的模板放置到 `window.__templates__` 对象中，因此测试的时候，我们需要使用遍历这个对象，并使用 `$templateCache` 注册模板：

```coffeescript
beforeEach inject ($injector) ->
  $templateCache = $injector.get '$templateCache'

  # Get all templates
  for id, template of window.__templates__
    $templateCache.put(id, template)
```

#### Directive 的使用与数据传递

接下来，我们需要使用 `$compile` 去编译待测试的 directive，得到一个 `link 函数`；紧接着构造一个 outerScope，并将 outerScope 作为 `link 函数` 的参数，完成 directive 模板与 outerScope 提供的数据进行绑定。Directive 所需要的数据，我们可以通过 outerScope 传递过去。

需要注意的是，`link 函数` 执行完成后，在下一次 digest 执行之前，数据并不会更新。在应用里 AngularJS 会自动更新，但在测试里不会，因此我们要自己调用 `$digest`。

```coffeescript
describe 'Directive: dpw-checkbox', ->
  $rootScope = null
  $compile   = null

  beforeEach(module 'dpw.common')
  beforeEach(inject ($injector) ->
    $rootScope = $injector.get '$rootScope'
    $compile   = $injector.get '$compile'
  )

  it 'model', ->
    # 创建 Parent Scope
    outerScope = $rootScope.$new()
    outerScope.isChecked = true

    element = $compile('<dpw-check model="isChecked"></dpw-check>')(outerScope)

    # 触发 digest，更新数据
    outerScope.$digest()
```

#### Directive 的数据断言

`dpw-checkbox` 是将数据绑定在一个 isolate 的 scope，因此我们需要获取到这个 innerScope，然后断言 scope 里各个属性的值。

```coffeescript
it 'model', ->
  # 这里省略获取 element 的步骤
  innerScope = element.isolateScope()

  expect(innerScope.model).to.be.true
```

更多时候，我们是将数据直接绑定到 directive 的 controller 上，此时我们可以通过 `element.controller()` 方法获取 controller。例如：

```coffeescript
it 'model', ->
  # 这里省略获取 element 的步骤
  ctrl = element.controller 'directiveName'

  # 调用 controller 的 updateState 方法
  ctrl.updateState state

  expect(ctrl.state).to.equal 'something'
```

#### Directive 的子元素断言

除了通过 compile 后的 element 获取 scope 和 controller，我们同样可以获取到 element 的子元素。然后检查子元素的各种状态。

```coffeescript
describe 'button', ->
  element = null

  beforeEach ->
    element = $compile('...')(outerScope)

  it 'should has a button', ->
    $button = element.find '#buttonId'
    expect($button.length).to.equal 1

  it 'should handle button click event', ->
    # 使用 trigger 触发 button 的 click 事件
    $button.trigger 'click'
    outerScope.$digest()

    expect(something).to.equal '...'
```

#### input 元素测试

首先，input 元素的 change 事件触发会比较特殊一点。如果单纯地通过 jQuery 的 `val()` 函数更改 input 值，并不会触发 input 的 change 事件，必须结合使用 `trigger` 函数：

```coffeescript
  it 'input test', ->
    # element = ...
    $inputElement.val('foo').trigger 'input'
    outerScope.$digest();

    # expect
```

如果 input 使用了 `ngModel`，并且使用了 [ngModelOptions](https://docs.angularjs.org/api/ng/directive/ngModelOptions) 的 `debounce` 时，我们需要借助 `$timeout.flush()` 来清除 debounce 的等待时间：

```coffeescript
  it 'input test', ->
    # element = ...
    $inputElement.val('foo').trigger 'input'
    $timeout.flush()

    # expect
```

实际上，任何有使用 `$timeout` 的地方我们都可使用 `$timeout.flush()` 来清除等待时间，从而让测试变成同步执行。

### 测试 Components

Component 的测试基本与 Directive 类似：引用 Module、依赖注入、获取模板以及使用 Component（同样是 $compile）。实际上，在 Angular 1.x 中 Component 仅仅是 Directive 的一层封装。

Component 倾向于抛弃 scope （还是可以使用），而使用 controller代替。因此为了测试的方便，ngMock 提供了 `$componentController` 方法，用于实例化一个 component 的 controller，而不用通过 $compile component 后去获取。

```coffeescript
describe 'Core Components', ->
  describle 'some-component', ->
    $componentController = null

    beforeEach(module 'someModule')
    beforeEach(inject ($injector) ->
      $componentController = $injector.get '$componentController'
    )

    it 'Component Controller Instance', ->
      $ctrl = $componentController 'someComponent'
      $ctrl.onSearch 'query'
      expect($ctrl.foo).equal 'bar'
```

除了这点以外，Component 的测试与 Directive 几乎相同。

---------------------------------------

## 修订版本

版本 | 日期 | 作者 | 修订信息
----|-----|------|-------
1.0 | 2016-08-08 | Vi | Initialization
1.1 | 2016-08-18 | Vi | First review