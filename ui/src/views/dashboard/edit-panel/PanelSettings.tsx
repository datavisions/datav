import { Box, Center, Image, Input, SimpleGrid, Switch, Text, Textarea } from "@chakra-ui/react"
import { upperFirst } from "lodash"
import { Panel, PanelEditorProps, PanelType } from "types/dashboard"
import PanelAccordion from "./Accordion"
import { EditorInputItem } from "../../../components/editor/EditorItem"
import PanelEditItem from "./PanelEditItem"
import { initPanelPlugins } from "src/data/panel/initPlugins"
import { useEffect } from "react"
import React from "react";

// in edit mode, we need to cache all the plugins we have edited, until we save the dashboard
let pluginsCachedInEdit = {}
let overridesCacheInEdit = {}
const PanelSettings = ({ panel, onChange }: PanelEditorProps) => {
 
    const onChangeVisualization = type => {
        pluginsCachedInEdit[panel.type] = panel.plugins[panel.type]
        overridesCacheInEdit[panel.type] = panel.overrides
        onChange((tempPanel:Panel) => {
            tempPanel.type = type
                        
            tempPanel.plugins = {
                [type]: pluginsCachedInEdit[type] ??  initPanelPlugins[type]
            }

            tempPanel.overrides = overridesCacheInEdit[type] ?? []
        })
    }
    
    useEffect(() => {
        return () => {
            pluginsCachedInEdit = {}
            overridesCacheInEdit= {}
        }
    },[])

    return (
        <>
            <PanelAccordion title="Basic setting" defaultOpen>
                <PanelEditItem title="Panel title">
                    <EditorInputItem value={panel.title} onChange={v => onChange(tempPanel => { tempPanel.title = v })}   />
                </PanelEditItem>
                <PanelEditItem title="Description" desc="give a short description to your panel">
                    <EditorInputItem type="textarea" value={panel.desc} onChange={v => onChange(tempPanel => { tempPanel.desc = v })}   />
                </PanelEditItem>
            </PanelAccordion>

            {/* panel visulization choosing */}
            <PanelAccordion title="Visualization" defaultOpen>
                <SimpleGrid columns={2} spacing="2">
                    {
                        Object.keys(PanelType).map((key) => {
                            if (PanelType[key] == PanelType.Row) {
                                return <></>
                            }
                            return <VisulizationItem
                                selected={panel.type == PanelType[key]}
                                title={upperFirst(PanelType[key])}
                                imageUrl={`/plugins/panel/${PanelType[key].toLowerCase()}.svg`}
                                onClick={() => onChangeVisualization(PanelType[key])}
                            />
                        })
                    }
                </SimpleGrid>
            </PanelAccordion>
        </>
    )
}

export default PanelSettings


const VisulizationItem = ({ title, imageUrl, onClick = null, selected = false }) => {
    return (
        <Box className={`tag-bg ${selected ? "highlight-bordered" : ""}`} onClick={onClick} pb="2" cursor="pointer">
            <Center >
                <Text>{title}</Text>
            </Center>
            <Image src={imageUrl} height="100px" width="100%" />
        </Box>

    )
}


