import {
  Mustache,
  // Scanner
} from '../mustache/index'

// const scanner = new Scanner('我买了一个{{thing}}，好{{mood}}啊！')

// const result = scanner.scanUntil('{{')
// console.log(result)
// document.write(result)

const data = [{
    name: '小明',
    hobbies: [
      '篮球', '唱歌'
    ]
  },
  {
    name: '小红',
    hobbies: [
      '唱', '跳', 'Rap'
    ]
  },
  {
    name: '小张',
    hobbies: [
      'A', 'B', 'C'
    ]
  }
]

const mustache = new Mustache()
const str = mustache.render('<div><ol>{{#students}}<li>学生{{name}}的爱好是<ol>{{#hobbies}}<li>{{.}}</li>{{/hobbies}}</ol></li>{{/students}}</ol></div>', data)

document.getElementsByClassName('container')[0].innerHTML = str
