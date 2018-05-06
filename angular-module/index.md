---
title: 从 Angular Module 聊起
date: 2016-08-25 15:06:33
thumbnail: module-definition.png
---

## AngularJS Module 设计思路

AngularJS 以 Module 来组织应用，很好。但是这意味着什么呢？
一个 AngularJS 应用需要一个 Main Module 来作为应用的入口，类似于 C 语言中的 main 函数。同时，Main Module 可以将其它的 Modules 作为依赖来组成一个大型的应用；这种依赖是使用声明的形式，例如：

```javascript
var main = angular.module('issuesManager', [
    'account',
    'issue',
    'helper'
]);
```

使用声明的形式清楚地描述了这个应用包含哪些 Modules（即哪些内容），挂载与移除某个内容只要作少量的修改。同时，在单元测试中仅需要针对特定的 Module 做测试。

## 应用的 Modules 层次

了解了 AngularJS 框架 Module 设计的一个思路，即可明白为了保证可重用性与可维护性，Module 应该具有高度的內聚性，减少外部的依赖。可以把一个 Module 想象成一个 Function，为了让 Function 可重用，通常会将 Function 设计成 [Pure Function](https://en.wikipedia.org/wiki/Pure_function)。

Module 包含特定内容的 Controllers，Directives，Services 和 Filters 等等。AngularJS 应用 Modules 的一种组织方式是将 Modules 分成三个层次：

<img class="full-image" src="/uploads/angular-modules-recommanded-setup.png"
  style="border: 1px solid #222;" alt="应用的 Modules 层次">

- **Common Modules**
    指包含可重用的 Components 的 Module。例如，Directives，Filters 以及 Services。
- **Feature Modules**
    指特定功能的 Modules。例如，Application Analytics 和 Dynamic App Gallery 等类似的 Module。
- **Main Module**
    指应用的主 Module。顾名思义，此 Module 将是应用的入口，并依赖上述两个层的所有 Modules。


## 深入理解 Module 

为了深入理解 AngularJS 中的 Module，首先我们先来看下 [angular.Module](https://docs.angularjs.org/api/ng/type/angular.Module)。

### angular.Module 类型

angular.Module 定义在 `ng` module 中，她是一种类型、是 module 的 interface；也就是说，通过 `angular.module` 方法获取到的 module 实际上都是 angular.Module 的实现（implements）。

angular.Module 定义的方法（版本 1.5.8）：

Methods|Methods
---|---
`provider(name, providerType)` | `factory(name, providerFunction)` 
`service(name, constructor)` | `value(name, object)`
`constant(name, object)` | `decorator(name, decorFn)`
`animation(name, animationFactory)` | `filter(name, filterFactory)`
`controller(name, constructor)` | `directive(name, directiveFactory)`
`component(name, options)` | `config(configFn)`
`run(initializationFn)` |

angular.Module 定义的属性如下（版本 1.5.8）：

Properties | Properties
---|---
`requires`|`name`