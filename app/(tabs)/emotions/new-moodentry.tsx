/* 2 possibilités : 
    - créer une nouvelle entrée 
    - modifier une entrée
    
    Si je crée l'entrée d'auj :
    Date = auj donc const today = new Date

    Choisir une émotion de niveau 1 = je veux des cubes/rectangles. Je vais devoir mapper

**/

import { useMood } from "@/context/MoodContext";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Emotion } from "@/types";
import { useState } from "react";
import { COLORS, SPACING } from "@/constants/theme";
import Slider from "@react-native-community/slider";

export default function newMoodEntryScreen() {
    const { emotions } = useMood();
    const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
    const [intensity, setIntensity] = useState(0);

    const today = new Date;

    const emotionsLevel1 = emotions.filter(emotion => emotion.level === 'LEVEL_1', [emotions]);
    console.log(emotionsLevel1);


    return (
        <>
            <View>
                
                {emotionsLevel1.map(emotionLevel1 => (
                    <TouchableOpacity
                        style={styles.emotionChoice}
                        key={emotionLevel1.idEmotion}
                        onPress={() => setSelectedEmotion(emotionLevel1)} // Et du coup ca se fait automatiquement si je presse une autre émotion ? 
                    >
                        <img src={emotionLevel1.iconUrl} />
                        <Text>{emotionLevel1.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {selectedEmotion && (
                <View>
                    <Text>Intensité : {intensity}/10</Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={10}
                        step={1}
                        value={intensity}
                        onValueChange={(value: number) => setIntensity(value)}
                        minimumTrackTintColor={`${COLORS.accent}`}
                        maximumTrackTintColor="#ccc"
                        thumbTintColor={`${COLORS.accent}`}
                    />
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    emotionChoice: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.backgroundVisible,
        borderRadius: SPACING.sm,
    }
})