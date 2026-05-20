/**
 * SEED_DOC — the default document loaded when no saved state is in localStorage.
 *
 * Demonstrates every block and mark type in use:
 *   • paragraph with inline GlossaryMark
 *   • PullQuoteBlock (right float)
 *   • another paragraph
 *   • ImageBlock (empty URL)
 *
 * Drawn from the Citizen Sleeper review prose in the Kaleidos editor spec.
 */
export const SEED_DOC = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            'Citizen Sleeper drops you onto the Eye — a decaying orbital station at the edge of corporate jurisdiction — as a ',
        },
        {
          type: 'text',
          text: 'Sleeper',
          marks: [{ type: 'glossaryMark', attrs: { termId: 142, term: 'Sleeper' } }],
        },
        {
          type: 'text',
          text:
            ': a digitised human consciousness running inside a body you do not own, hunted by the corporation that manufactured you. The premise is bleak and it is meant to be.',
        },
      ],
    },
    {
      type: 'pullQuoteBlock',
      attrs: {
        text:
          'The game is not interested in whether you survive. It is interested in whether you deserve to.',
        float: 'right',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text:
            "Your primary resource is dice. Each cycle — each in-game day — you roll a pool of them and assign them to actions: scavenging for components, taking shifts at the dockyard, pushing deeper into a character's story. The numbers carry weight because the writing does not let you forget that numbers represent people, time, a body wearing down.",
        },
      ],
    },
    {
      type: 'imageBlock',
      attrs: {
        url: '',
        alt: 'The Eye station at night',
        caption: "The Eye's central hub at the start of a new cycle.",
      },
    },
  ],
};
