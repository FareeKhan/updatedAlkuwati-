import { StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native'
import React, { useState, useRef } from 'react'
import ExportSvg from '../constants/ExportSvg'
import { color } from '../constants/color'
import { preloadImagesInBatches, extractProductImages, isImagePreloaded, PRIORITY } from '../utils/ImagePreloader'

const SearchInput = ({ value, onChangeText, searchResults }) => {
    const [isLoader, setIsLoader] = useState(false)
    const [imageLoadingProgress, setImageLoadingProgress] = useState(0)
    const [imagesPreloaded, setImagesPreloaded] = useState(false)
    const isMountedRef = useRef(true)

    React.useEffect(() => {
        isMountedRef.current = true
        const preload = async () => {
            setIsLoader(true)
            setImagesPreloaded(false)
            const allImages = extractProductImages(searchResults || [])
            if (allImages.length > 0) {
                const allPreloaded = allImages.every(isImagePreloaded)
                if (allPreloaded) {
                    setImagesPreloaded(true)
                    setIsLoader(false)
                } else {
                    await preloadImagesInBatches(
                        allImages,
                        5,
                        (completed, total) => {
                            if (!isMountedRef.current) return
                            setImageLoadingProgress(Math.round((completed / total) * 100))
                        },
                        { priority: PRIORITY.HIGH }
                    )
                    if (isMountedRef.current) {
                        setImagesPreloaded(true)
                        setIsLoader(false)
                    }
                }
            } else {
                setImagesPreloaded(true)
                setIsLoader(false)
            }
        }
        if (searchResults && searchResults.length > 0) {
            preload()
        }
        return () => {
            isMountedRef.current = false
        }
    }, [searchResults])

    return (
        <View style={styles.container}>
            <ExportSvg.Search style={{
                marginLeft: 18,
                marginRight: 10
            }} />
            <TextInput
                placeholder='Search...'
                style={{ width: "80%", color: "#000" }}
                placeholderTextColor={color.gray}
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
            />
            {isLoader || !imagesPreloaded ? (
                <ActivityIndicator size="small" color={color.theme} style={{ marginLeft: 10 }} />
            ) : null}
        </View>
    )
}

export default SearchInput

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.gray.concat('10'),
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        borderRadius: 30,


    }
})