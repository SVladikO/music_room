import {useState} from 'react';

import GuitarChord from '../../components/guitar-chord';
import UkuleleChord from '../../components/ukulele-chord';
import PianoChord from '../../components/piano-chord';
import ChordName from '../../components/chord-name';
import Tabs from '../../components/tabs';
import Header from '../../components/header';

import guitarData from '../../data/guitar';
import ukuleleData from '../../data/ukulele';
import pianoData from '../../data/piano';

import {INSTRUMENT_TYPE, INSTRUMENT_TABS} from './utils'

const guitarChordsObj = {};

guitarData.forEach(chordGroup => {
    chordGroup.chords.forEach(chord => {
        guitarChordsObj[chord.name] = {...chord};
    })
})

const ukuleleChordsObj = {};

ukuleleData.forEach(chordGroup => {
    chordGroup.chords.forEach(chord => {
        ukuleleChordsObj[chord.name] = {...chord};
    })
})

const pianoChordsObj = {};

pianoData.forEach(chordGroup => {
    chordGroup.chords.forEach(chord => {
        pianoChordsObj[chord.name] = {...chord};
    })
})

function ChordsPage() {
    const [selectedTab, setSelectedTab] = useState(INSTRUMENT_TYPE.GUITAR);
    const [selectedChords, setSelectedChords] = useState([]);

    const addChord = chord => setSelectedChords([...selectedChords, chord]);
    const deleteChord = chordIndex => setSelectedChords([...selectedChords.filter((c, i) => i !== chordIndex)]);
    const deleteAllSelectedChord = () => setSelectedChords([]);

    return (
        <div class='wrapper'>
            <Tabs
                selectedTab={selectedTab}
                tabs={INSTRUMENT_TABS}
                onTabClick={tabType => setSelectedTab(tabType)}
            />
            <p className="center-content">Click on chords which you need.</p>
            <SelectedChords
                selectedTab={selectedTab}
                deleteChord={deleteChord}
                selectedChords={selectedChords}
                deleteAllSelectedChord={deleteAllSelectedChord}
            />
            <TabContent
                selectedTab={selectedTab}
                addChord={addChord}
                deleteChord={deleteChord}/>
        </div>
    )
}


const TabContent = ({selectedTab, addChord, deleteChord}) => {
    const renderChords = (chord, ChordComponent) => (
        <div className={`accord-groups`}>
            {chord.chords.map((d, index) =>
                <ChordComponent
                    key={d.name + index}
                    chord={d}
                    chordIndex={index}
                    onChordSelect={addChord}
                    onChordDelete={deleteChord}
                />)
            }
        </div>
    );

    const renderChordName = (chordGroup) => (
        <div className={`accord-groups`}>
            {chordGroup.chords.map(chord => <ChordName name={chord.name} addChord={addChord}/>)}
        </div>
    )

    const renderTabContent = () => {
        switch (selectedTab) {
            case INSTRUMENT_TYPE.GUITAR:
                return guitarData.map(chords => renderChords(chords, GuitarChord));
            case INSTRUMENT_TYPE.UKULELE:
                return ukuleleData.map(chords => renderChords(chords, UkuleleChord));
            case INSTRUMENT_TYPE.PIANO:
                return pianoData.map(chords => renderChords(chords, PianoChord));
            case INSTRUMENT_TYPE.CHORD_NAME_ONLY:
                return guitarData.map(chords => renderChordName(chords));
        }
    }

    return (
        <div className="tab-content">
            {renderTabContent()}
        </div>
    );
}

const SelectedChords = ({selectedChords, selectedTab, deleteAllSelectedChord, deleteChord}) => {
    if (!selectedChords.length) {
        return;
    }

    const renderChords = (chords, ChordComponent) => (
        <div className={`accord-groups accord-selected-groups`}>
            {chords.map((d, index) =>
                <ChordComponent
                    key={d.name + index}
                    chord={d}
                    chordIndex={index}
                    onChordDelete={deleteChord}
                    isSelected
                />)
            }
        </div>
    );

    const renderChordNames = () => (
        <div>
            {/*<div style={{margin: '0 auto'}}>This page added for simpler accord search</div>*/}
            <div className={`accord-groups accord-selected-groups`}>
                {selectedChords.map(name => <ChordName name={name}/>)}
            </div>
        </div>
    )

    console.log({selectedChords})

    function getContent() {
        let chords;

        switch (selectedTab) {
            case INSTRUMENT_TYPE.GUITAR:
                chords = selectedChords.map(chordName => ({...guitarChordsObj[chordName]}))
                return renderChords(chords, GuitarChord);

            case INSTRUMENT_TYPE.UKULELE:
                chords = selectedChords.map(chordName => ({...ukuleleChordsObj[chordName]}))
                return renderChords(chords, UkuleleChord);

            case INSTRUMENT_TYPE.PIANO:
                chords = selectedChords.map(chordName => ({...pianoChordsObj[chordName]}))
                return renderChords(chords, PianoChord);
            case INSTRUMENT_TYPE.CHORD_NAME_ONLY:
                return renderChordNames();
        }
    }

    return (
        <div className='selected-chords-wrapper'>
            {getContent()}
            <div className='delete-all-chords' onClick={deleteAllSelectedChord}>Delete all</div>
        </div>
    )
}

export default ChordsPage;
