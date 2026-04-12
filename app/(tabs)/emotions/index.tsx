/* 
    nav tab pour choisir l'écran : stats ou moodEntry
    J epeux donc construire la navigation entre les deux 
**/
import { useState, useEffect } from "react";
import { COLORS, SPACING } from "@/constants/theme";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useAuth } from "@/context/AuthContext";
import { useMood } from "@/context/MoodContext";


export default function MoodEntryStatsScreen() {
    const { user } = useAuth();
    const { emotions, entries, fetchEntries, fetchEmotions } = useMood();
    const [activeTab, setActiveTab] = useState('Journal'); // 'Journal' ou 'Stats'
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // format 'YYYY-MM'

    useEffect(() => {
        if (user) {
            fetchEntries();
            fetchEmotions();
        }
    }, [user]);

    /**
     * Configuration de la locale pour le calendrier en français
     */
    LocaleConfig.locales['fr'] = {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
        today: "Aujourd'hui"
    };

    LocaleConfig.defaultLocale = 'fr';
    // je veux faire apparaitre chaque titre puis pour chaque titre je veux associer une couleur.

    const EMOTION_COLORS: Record<string, string> = {
        'Joie': '#FED95D',
        'Tristesse': '#89C9EF',
        'Colère': '#FF8F75',
        'Peur': '#C29FE9',
        'Dégoût': '#B8E083',
        'Surprise': '#FCB1FC',
    }

    const markedDates: Record<string, any> = {};
    entries.forEach(entry => {
        const emotionTitle = entry.emotion?.title || '';
        const date = entry?.emotionDate?.split('T')[0];
        if (!date) return;
        if (date.slice(0, 7) !== currentMonth) return;
        // if (!markedDates[date]) markedDates[date] = { dots: [] };
        markedDates[date] = {
            customStyles: {
                container: {
                    backgroundColor: EMOTION_COLORS[emotionTitle] || COLORS.accent,
                    borderRadius: SPACING.md,
                },
                text: {
                    color: '#fff',
                    // fontWeight: 'bold',
                }
            }
            // markedDates[date].dots.push({
            //     key: emotionTitle,
            //     color: EMOTION_COLORS[emotionTitle] || COLORS.accent,
            // });
        }
    });

    const today = new Date().toISOString().split('T')[0];
    if (today.slice(0, 7) === currentMonth) {
        markedDates[today] = {
            ...(markedDates[today] || {}),
            customStyles: {
                ...(markedDates[today]?.customStyles || {}),
                container: {
                    ...(markedDates[today]?.customStyles?.container || {}),
                    borderWidth: 1,
                    borderColor: COLORS.accent,
                    borderRadius: SPACING.md,
                },
                text: {
                    ...(markedDates[today]?.customStyles?.text || {}),
                    color: COLORS.accent,
                    // fontWeight: 'bold',
                }
            }
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.navTabs}>
                <TouchableOpacity
                    style={activeTab === 'Journal' ? styles.activeTab : styles.tab}
                    onPress={() => setActiveTab('Journal')}
                ><Text style={activeTab === 'Journal' ? styles.activeTabText : styles.tabText}>Journal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={activeTab === 'Stats' ? styles.activeTab : styles.tab}
                    onPress={() => setActiveTab('Stats')}
                ><Text style={activeTab === 'Stats' ? styles.activeTabText : styles.tabText}>Stats</Text>
                </TouchableOpacity>
            </View>
            <View>
                {activeTab === 'Journal' ? (
                    /* Affichage du journal */
                    <Calendar
                        theme={{
                            calendarBackground: '#fff',
                            selectedDayBackgroundColor: COLORS.accent, // fond du jour sélectionné
                            selectedDayTextColor: '#fff', // texte du jour sélectionné
                            textSectionTitleColor: COLORS.neutral.gray,
                            // todayBackgroundColor: COLORS.backgroundVisible, // fond du jour actuel
                            todayTextColor: COLORS.accent, // texte du jour actuel
                            dayTextColor: '#2d4150',
                            arrowColor: COLORS.accent,
                            monthTextColor: COLORS.accent,
                            indicatorColor: COLORS.accent,
                        }}
                        style={styles.calendarContainer}
                        key={currentMonth}
                        firstDay={1}
                        minDate={'2026-01-01'}
                        maxDate={'2036-01-01'}
                        onMonthChange={month => setCurrentMonth(month.dateString.slice(0, 7))}
                        current={today} // Date actuelle au format YYYY-MM-DD
                        markingType="custom" // markingType="multi-dot"
                        markedDates={markedDates}
                        onDayPress={(day) => {
                            console.log('selected day', day);
                        }} />

                ) : (
                    <Text>Contenu des stats</Text>
                    /* Affichage des stats */
                )}
            </View>
        </View>

    )

}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.md,
    },
    navTabs: {
        // flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.backgroundVisible,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SPACING.md,
        padding: SPACING.xs - 2,
    },
    tab: {
        padding: SPACING.md,
        flex: 1,
        borderRadius: SPACING.md,
    },
    activeTab: {
        padding: SPACING.md,
        flex: 1,
        backgroundColor: COLORS.accent,
        borderRadius: SPACING.md,
    },
    tabText: {
        textAlign: 'center',
        color: COLORS.neutral.darkGray,
        fontWeight: 'bold',
    },
    activeTabText: {
        textAlign: 'center',
        color: COLORS.neutral.white,
        fontWeight: 'bold',
    },
    calendarContainer: {
        borderWidth: 2,
        borderColor: COLORS.backgroundVisible,
        borderRadius: SPACING.md,
        padding: SPACING.md,
        marginTop: SPACING.md,
    }
})



/* 
Si tu veux un système encore plus solide, tu peux adapter selon la taille d’écran :
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
export const scale = (size) => (width / 375) * size;

Puis :
padding: scale(16)
**/