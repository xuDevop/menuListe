$(document).ready(function() {
    /*声明变量sub指向子菜单 1*/
    var sub = $('#sub')

    /*声明变量 指向被激活的一级菜单中的行 1*/
    var activeRow

    /*声明变量 与之对应的二级菜单 1*/
    var activeMenu

    var timer /*4 */
    var mouseInSub = false /* 用来标识 当前鼠标是否在子菜单里 4*/

    sub.on('mouseenter', function(e) { /* 给子菜单绑定事件 4*/
        mouseInSub = true
    }).on('mouseleave', function(e) {
        mouseInSub = false
    })

    var mouseTrack = []

    var moveHandler = function(e) {
        mouseTrack.push({
            x: e.pageX,
            y: e.pageY
        })

        if (mouseTrack.length > 3) {
            mouseTrack.shift()
        }
    }

    /*变量指向一级菜单 1*/
    $('#test')
        /*给一级菜单绑定事件 当鼠标移动到一级菜单，显示二级菜单 1*/
        .on('mouseenter', function(e) {
            sub.removeClass('none')

            $(document).on('mousemove', moveHandler)
        })
        /*当鼠标离开时，隐藏二级菜单 1*/
        .on('mouseleave', function(e) {
            sub.addClass('none')

            /*如果存在激活 把样式去掉 并把变量制空 1*/
            if (activeRow) {
                activeRow.removeClass('active')
                activeRow = null
            }
            /*对应的二级菜单 如果存在激活 把样式去掉 并把变量制空 1*/
            if (activeMenu) {
                activeMenu.addClass('none')
                activeMenu = null
            }

            $(document).unbind('mousemove', moveHandler)
        })

    /*给一级菜单的每一个列表项绑定事件  1*/
    .on('mouseenter', 'li', function(e) {
        /*没有激活的列表项 1*/
        if (!activeRow) {
            /*直接把激活的列表项指向事件目标 1*/
            activeRow = $(e.target).addClass('active')
                /*然后选中对应的二级菜单 1*/
            activeMenu = $('#' + activeRow.data('id'))
            activeMenu.removeClass('none')
            return
        }

        if (timer) { /*如果事件触发的时候 如果计时器还没有执行 就把计时器清掉 4 */
            clearTimeout(timer)
        }

        var currMousePos = mouseTrack[mouseTrack.length - 1] /*通过上面声明的数组中 拿到鼠标当前的坐标 5*/
        var leftCorner = mouseTrack[mouseTrack.length - 2]

        var delay = needDelay(sub, leftCorner, currMousePos)

        if (delay) {
            timer = setTimeout(function() { /*加入延迟 为了从一级菜单到二级菜单 实现可以折线移动 有助于用户体验 3*/
                if (mouseInSub) { /*如果鼠标在子菜单里 不处理 立刻返回 4*/
                    return
                }

                /*从一个列表项移动到另一个列表项时 清除激活状态 2*/
                activeRow.removeClass('active')
                activeMenu.addClass('none')

                /*然后把它指向当前的 2*/
                activeRow = $(e.target)
                activeRow.addClass('active')
                activeMenu = $('#' + activeRow.data('id'))
                activeMenu.removeClass('none')
                timer = null /*4 */
            }, 300)
        } else {
            var preActiveRow = activeRow
            var preActiveMenu = activeMenu

            activeRow = $(e.target)
            activeMenu = $('#' + activeRow.data('id'))

            preActiveRow.removeClass('active')
            preActiveMenu.addClass('none')

            activeRow.addClass('active')
            activeMenu.removeClass('none')

        }

    })

})