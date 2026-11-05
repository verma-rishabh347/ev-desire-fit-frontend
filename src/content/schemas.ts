import { z } from 'zod';
export const schemas = {
  pages: {
    home: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "headlineAccent": z.string(),
        "subheading": z.string(),
        "ctaPrimary": z.string(),
        "ctaSecondary": z.string()
      }),
      "stats": z.array(z.object({
        "id": z.string(),
        "value": z.string(),
        "label": z.string()
      })),
      "products": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "subheading": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "title": z.string(),
          "category": z.string(),
          "description": z.string(),
          "spec1Label": z.string(),
          "spec1Value": z.string(),
          "spec2Label": z.string(),
          "spec2Value": z.string()
        }))
      }),
      "why": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "subheading": z.string(),
        "differentiators": z.array(z.object({
          "id": z.string(),
          "number": z.string(),
          "title": z.string(),
          "description": z.string()
        }))
      }),
      "industries": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "title": z.string(),
          "description": z.string(),
          "stat": z.string()
        }))
      }),
      "cta": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "subheading": z.string(),
        "ctaLabel": z.string()
      })
    }),
    products: z.object({
      "meta": z.object({
        "title": z.string(),
        "description": z.string()
      }),
      "hero": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "subheading": z.string()
      }),
      "categories": z.array(z.object({
        "id": z.string(),
        "chargerType": z.enum(["ac", "dc"]),
        "slug": z.string(),
        "label": z.string(),
        "title": z.string(),
        "tagline": z.string(),
        "description": z.string(),
        "specs": z.array(z.object({
          "id": z.string(),
          "label": z.string(),
          "value": z.string()
        })),
        "features": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      })),
      "portable": z.object({
        "eyebrow": z.string(),
        "badge": z.string(),
        "title": z.string(),
        "tagline": z.string(),
        "description": z.string(),
        "highlights": z.array(z.object({
          "id": z.string(),
          "label": z.string(),
          "detail": z.string()
        })),
        "specs": z.array(z.object({
          "id": z.string(),
          "label": z.string(),
          "value": z.string()
        }))
      }),
      "cta": z.object({
        "headline": z.string(),
        "subheading": z.string(),
        "ctaLabel": z.string(),
        "email": z.string()
      })
    }),
    industries: z.object({
      "meta": z.object({
        "title": z.string(),
        "description": z.string()
      }),
      "hero": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "subheading": z.string()
      }),
      "sectors": z.array(z.object({
        "id": z.string(),
        "title": z.string(),
        "eyebrow": z.string(),
        "description": z.string(),
        "challenges": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        })),
        "solutions": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        })),
        "stat1Value": z.string(),
        "stat1Label": z.string(),
        "stat2Value": z.string(),
        "stat2Label": z.string()
      })),
      "cta": z.object({
        "headline": z.string(),
        "subheading": z.string(),
        "ctaLabel": z.string(),
        "email": z.string()
      })
    }),
    about: z.object({
      "meta": z.object({
        "title": z.string(),
        "description": z.string()
      }),
      "hero": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "subheading": z.string()
      }),
      "mission": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "body1": z.string(),
        "body2": z.string(),
        "body3": z.string()
      }),
      "story": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "question": z.string(),
        "body1": z.string(),
        "body2": z.string(),
        "body3": z.string()
      }),
      "values": z.array(z.object({
        "id": z.string(),
        "number": z.string(),
        "title": z.string(),
        "description": z.string()
      })),
      "stats": z.array(z.object({
        "id": z.string(),
        "value": z.string(),
        "label": z.string()
      })),
      "certifications": z.array(z.object({
        "id": z.string(),
        "title": z.string(),
        "description": z.string()
      })),
      "cta": z.object({
        "headline": z.string(),
        "subheading": z.string(),
        "ctaLabel": z.string(),
        "email": z.string()
      })
    }),
    contact: z.object({
      "meta": z.object({
        "title": z.string(),
        "description": z.string()
      }),
      "hero": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "subheading": z.string()
      }),
      "contactDetails": z.object({
        "email": z.string(),
        "phone": z.string(),
        "availability": z.string(),
        "supportNote": z.string()
      }),
      "formLabels": z.object({
        "nameLabel": z.string(),
        "namePlaceholder": z.string(),
        "companyLabel": z.string(),
        "companyPlaceholder": z.string(),
        "emailLabel": z.string(),
        "emailPlaceholder": z.string(),
        "phoneLabel": z.string(),
        "phonePlaceholder": z.string(),
        "sectorLabel": z.string(),
        "messageLabel": z.string(),
        "messagePlaceholder": z.string(),
        "submitLabel": z.string()
      }),
      "sectors": z.array(z.object({
        "id": z.string(),
        "value": z.string(),
        "label": z.string()
      })),
      "whyContact": z.array(z.object({
        "id": z.string(),
        "number": z.string(),
        "title": z.string(),
        "description": z.string()
      })),
      "faqs": z.array(z.object({
        "q": z.string(),
        "a": z.string(),
        "id": z.string()
      }))
    }),
    solutions: z.object({
      "meta": z.object({
        "title": z.string(),
        "description": z.string()
      }),
      "hero": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "subheading": z.string()
      }),
      "solutions": z.array(z.object({
        "id": z.string(),
        "number": z.string(),
        "title": z.string(),
        "tagline": z.string(),
        "description": z.string(),
        "deliverables": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      })),
      "process": z.object({
        "eyebrow": z.string(),
        "headline": z.string(),
        "steps": z.array(z.object({
          "id": z.string(),
          "number": z.string(),
          "title": z.string(),
          "description": z.string()
        }))
      }),
      "cta": z.object({
        "headline": z.string(),
        "subheading": z.string(),
        "ctaLabel": z.string(),
        "email": z.string(),
        "phone": z.string()
      })
    })
  }
};
export type Schemas = typeof schemas;
