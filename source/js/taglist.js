document.onreadystatechange = function () {
  if (document.readyState === "interactive") {
    let old = "",
      selList = new Set(),
      sel = (select) => document.querySelector(select) || null,
      selAll = (select) => document.querySelectorAll(select) || null,
      change = (target, operate, val) => {
        target.classList[operate]("select")
        return val || ""
      }
    sel("#tags").addEventListener("click", function (e) {
      const _this = e.target
      if (_this.tagName == "INPUT") {
        let parent = _this.parentNode
        selList[_this.checked ? change(parent, "add", "add") : change(parent, "remove", "delete")](_this.value)
        if (!selList.size) {
          selAll("#title-list a").forEach(ele => ele.classList.remove("select"))
        } else {
          selAll("#title-list a").forEach(ele => {
            const arr = ele.dataset.tags.split(",")
            new Set([...arr, ...selList]).size != arr.length + selList.size ? change(ele, "remove") : change(ele, "add")
          })
        }
        selAll(".year").forEach(ele => {
          ele.children.length - ele.querySelectorAll(".select").length == 1 ? change(ele, "add") : change(ele, "remove")
        })
      }
    })

    sel("#categories").addEventListener("click", (e) => {
      const _this = e.target
      if (_this.tagName == "INPUT") {
        return e.preventDefault()
      }
      if (_this.tagName == "LABEL") {
        old = old || _this
        change(old, "remove") //移除之前的label选中状态
        const child = _this.querySelector("input")
        if (child.checked) { //如果已经选中
          selAll("#title-list .select").forEach(v => change(v, "remove"))
          child.checked = false //移除选中
        } else {
          change(_this, "add")
          child.checked = true
          selAll("#title-list a").forEach(v => {
            change(v, new RegExp(child.value).test(v.className) ? "remove" : "add")
          })
        }
        old = _this
        return e.stopPropagation()
      }
    })

    sel("#cleansel").onclick = function () {
      this.classList.toggle("toggle")
      selAll(".taglist").forEach(v => v.classList.toggle("show"))
      selAll(".taglist input").forEach(v => v.checked = false)
      selAll(".article .select").forEach(v=> change(v,"remove"))
    }
  }
}