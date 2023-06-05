var Mock = require('mockjs')

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

export const mockData = Mock.mock({
    'pods|15':[{
        'key|+1': 1,
        'name|1':['foo','bar','hello', 'world'],
        'namespace|1': ['foo', 'bar', 'kube-system', 'core'],
        'status|1': ['Running', 'Pending', 'Failed', 'Succeeded', 'Unknown'],
        'age|10-100':50,
        'restarts|0-20':10,
        'image|3': /\w\W\s\S\d\D-/,
    }],
    'deployments|15':[{
        'key|+1': 1,
        'name|1':['foo','bar','hello', 'world'],
        'namespace|1': ['foo', 'bar', 'kube-system', 'core'],
        'desired':'@integer(3, 7)',
        'available':function(){
            //@ts-ignore
            return this.desired - getRandomInt(0,3)
        },
        //@ts-ignore
        'healthy':function() {
            //@ts-ignore
            return this.avaiable === this.desired
        } 
    }]
})

