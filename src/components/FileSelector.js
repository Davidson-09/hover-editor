import React from 'react'
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import cancelIcon from '../assets/icons/cancel.svg'
import { getProgrammingLanguage } from '../utility/fileFunctions';
import { useDispatch, useSelector } from 'react-redux'
import { changeCurrentFile } from '../redux/features/currentFIle/currentFileSlice'

export default function FileSelector({fileTree, setIsVisble, setReload}) {

    const dispatch = useDispatch()

    const currentFile = useSelector(state => state.currentFile.value)

    const openFile = async (item)=>{
        try{
            const fileContent = await window.electronApi.filesApi.openFile(item)
            const newCurrentFile = {
                ...item,
                isNewFile: false,
                programmingLanguage: getProgrammingLanguage(item.path),
                fileContent
            }
            dispatch(changeCurrentFile(newCurrentFile))
            // update current file item
        } catch(e){
            alert(e)
        }
    }

    return (
    <div className='h-screen absolute bg-white border border-black border-r-gray-700 z-30 top-0 overflow-scroll max-w-sm'>
        <div className='bg-gray-200 flex items-center justify-between p-3'>
            <p className='text-black'>File Explorer</p>
            <div className='hover:bg-gray-300 p-1 rounded-full' onClick={()=>setIsVisble(false)}>
                <img src={cancelIcon} alt='close file selector' className='h-4 w-4'/>
            </div>
        </div>
        
        <UncontrolledTreeEnvironment
        dataProvider={new StaticTreeDataProvider(fileTree, (item, data) => ({ ...item, data }))}
        getItemTitle={item => item.data}
        onFocusItem={item => {
            if (!item.isFolder){
                openFile(item)
            }
        }}
        onRenameItem={async(item, name) => {
            try{
                const newPath = await window.electronApi.filesApi.renameFile(item.path, name)
                console.log(newPath, 'from front')
                setReload(prevVal => prevVal+1)
                console.log(item, 'the item')
                // change the name on item
                let newCurrentFile = {...currentFile}
                newCurrentFile.index = name
                newCurrentFile.data = name
                newCurrentFile.path = newPath
                dispatch(changeCurrentFile(newCurrentFile))
            }catch(e){
                alert(e)
            }
        }}
        viewState={{}}
        >
            <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
        </UncontrolledTreeEnvironment>
    </div>

    )
}
