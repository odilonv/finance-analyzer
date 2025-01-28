import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import CardComponent from '../Card/CardComponent';

function BoardComponent({ titleText, colorTitleText, subText, colorSubText, cards, state }) {
    return (
        <div
            className='default-container'
            style={{
                flexDirection: 'column',
                display: 'flex',
                width: '25%',
                height: '78vh',
                padding: '15px',
                overflowY: 'auto',
            }}>
            <h1 style={{
                fontSize: '1em',
                fontWeight: '600',
                lineHeight: '110%',
                textAlign: 'center',
                width: '100%',
                color: colorTitleText ?? 'var(--black)'
            }}>{titleText}</h1>
            {
                subText && <h5 style={{
                    fontSize: '1.2em',
                    fontWeight: 'initial',
                    textAlign: 'left',
                    color: colorSubText ?? 'var(--black)'
                }}>{subText}</h5>
            }
            <Droppable droppableId={state.toString()}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '15px 0',
                            gap: '10px',
                            height: '100%',
                        }}
                    >
                        {cards.map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            userSelect: 'none',
                                            minHeight: '50px',
                                            backgroundColor: '#fff',
                                            borderRadius: '10px',
                                            color: '#333',
                                            ...provided.draggableProps.style
                                        }}
                                    >
                                        <CardComponent card={card} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div >
    );
}

export default BoardComponent;
