import { isEmpty } from "lodash"
import { Panel, PanelQuery, PanelType } from "types/dashboard"
import { NodeGraphPluginData } from "types/plugins/nodeGraph"
import { TimeRange } from "types/time"

export const jaegerToPanels = (rawData: any[], panel: Panel, query: PanelQuery, range: TimeRange) => {
    if (rawData.length == 0) {
        return null
    }

    switch (panel.type) {
        case PanelType.NodeGraph:
            return jaegerToNodeGraphData(rawData, query)

        case PanelType.Graph:
        case PanelType.Stat:
        case PanelType.Gauge:
        case PanelType.Pie:
        case PanelType.Echarts:
            return null
    }
}




// 0 
// {parent: "frontend", child: "driver", callCount: 11}
// 1
// : 
// {parent: "customer", child: "mysql", callCount: 11}
// 2
// : 
// {parent: "driver", child: "redis", callCount: 149}
// 3
// : 
// {parent: "frontend", child: "route", callCount: 110}
// 4
// : 
// // {parent: "frontend", child: "customer", callCount: 11}
// {
//     id: `node-${i}`,
//     label: `node-${i}`,
//     data: {
//       success: Math.round(Math.random() * 1000),
//       error: Math.round(Math.random() * 100),
//     }
//   }
// {
//     source: `node-${i}`,
//     target: `node-${j}`,
//     label:  `${req}/${error}`,
//     data: {
//       req: req,
//       error: error,
//     },
//   })
// }
const jaegerToNodeGraphData = (rawData: any[], query: PanelQuery):NodeGraphPluginData => {
    console.log("here33333:",rawData)
    const data = {
        nodes: [],
        edges: []
    }

    const showServices = query.data?.showServices ? query.data?.showServices?.split(",") : []
    rawData.forEach((item, i) => {
        if (showServices.length > 0) {
            if (!showServices.includes(item.parent) && !showServices.includes(item.child)) {
                return
            }
        }
        data.nodes.find(n => n.id == item.parent) || data.nodes.push({
            id: item.parent,
            label: item.parent,
            data: {
                success: 0,
            }
        })

        const child = data.nodes.find(n => n.id == item.child)
        if (!child) {
            data.nodes.push({
                id: item.child,
                label: item.child,
                data: {
                    success: item.callCount,
                }
            })
        } else {
            child.data.success += item.callCount
        }

        data.edges.push({
            source: item.parent,
            target: item.child,
            label: `${item.callCount}`,
            data: {
                success: item.callCount,
            }
        })
    })

    console.log("here33333:",data)
    return data
}