import type { SectionConfig } from "@yext/visual-editor";
import { msg, pt } from "@yext/visual-editor";

import * as React from "react";
import {
  Background,
  EntityField,
  VisibilityWrapper,
  createItemSource,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  useDocument,
  type ThemeColor,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { PuckComponent } from "@puckeditor/core";
import {
  getTextStyle,
  makeText,
  makeThemeColor,
  type StyledTextProps,
} from "../shared/sectionHelpers";

type OfferingsMenuItemProps = {
  label: YextEntityField<TranslatableString>;
  unavailable?: boolean;
};

const offeringsItemSource = createItemSource<OfferingsMenuItemProps>({
  label: msg("fields.items", "Items"),
  mappingFields: {
    label: {
      label: msg("fields.label", "Label"),
      type: "entityField",
      filter: { types: ["type.string"] },
    },
    unavailable: {
      label: msg("fields.unavailable", "Unavailable"),
      type: "radio",
      options: [
        { label: msg("fields.yes", "Yes"), value: true },
        { label: msg("fields.no", "No"), value: false },
      ],
    },
  },
  defaultValues: [
    {
      label: {
        field: "",
        constantValue:
          "Menu: Appetizers, Salads, Soups, Entree's, Dessert, Draft Beer, Cocktails",
        constantValueEnabled: true,
      },
      unavailable: false,
    },
    {
      label: {
        field: "",
        constantValue: "Dine-in",
        constantValueEnabled: true,
      },
      unavailable: false,
    },
    {
      label: {
        field: "",
        constantValue: "Takeout",
        constantValueEnabled: true,
      },
      unavailable: false,
    },
    {
      label: {
        field: "",
        constantValue: "Delivery",
        constantValueEnabled: true,
      },
      unavailable: false,
    },
    {
      label: {
        field: "",
        constantValue: "Curbside pickup",
        constantValueEnabled: true,
      },
      unavailable: false,
    },
    {
      label: {
        field: "",
        constantValue: "Call-Ahead",
        constantValueEnabled: true,
      },
      unavailable: false,
    },
    {
      label: {
        field: "",
        constantValue: "Reservations via Opentable",
        constantValueEnabled: true,
      },
      unavailable: false,
    },
    {
      label: {
        field: "",
        constantValue: "Handicap Access",
        constantValueEnabled: true,
      },
      unavailable: false,
    },
    {
      label: {
        field: "",
        constantValue: "Wi-Fi",
        constantValueEnabled: true,
      },
      unavailable: true,
    },
    {
      label: {
        field: "",
        constantValue: "Safe handling",
        constantValueEnabled: true,
      },
      unavailable: false,
    },
  ],
});

type OfferingsSectionProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
  offerings: {
    heading: StyledTextProps;
    reverseSpin: boolean;
    addFork: number;
    items: typeof offeringsItemSource.value;
  };
};

type OfferingsStyle = React.CSSProperties & Record<`--${string}`, string>;
const defaultProps: OfferingsSectionProps = {
  section: {
    visibleOnLivePage: true,
    backgroundColor: makeThemeColor(
      "palette-tertiary",
      "palette-tertiary-contrast",
    ),
  },
  offerings: {
    heading: makeText("Offerings"),
    reverseSpin: false,
    addFork: 0,
    items: offeringsItemSource.defaultValue,
  },
};

const offeringsFields: YextFields<OfferingsSectionProps> = {
  section: {
    label: msg("fields.section", "Section"),
    type: "object",
    objectFields: {
      visibleOnLivePage: {
        label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
        type: "radio",
        options: [
          { label: msg("fields.yes", "Yes"), value: true },
          { label: msg("fields.no", "No"), value: false },
        ],
      },
      backgroundColor: {
        label: msg("fields.backgroundColor", "Background Color"),
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
    },
  },
  offerings: {
    label: msg("fields.offerings", "Offerings"),
    type: "object",
    objectFields: {
      heading: {
        label: msg("fields.heading", "Heading"),
        type: "object",
        objectFields: {
          text: {
            label: msg("fields.text", "Text"),
            type: "entityField",
            filter: { types: ["type.string"] },
          },
          styles: {
            label: msg("fields.textStyles", "Text Styles"),
            type: "styledText",
          },
          fontColor: {
            label: msg("fields.fontColor", "Font Color"),
            type: "basicSelector",
            options: "SITE_COLOR",
          },
        },
      },
      reverseSpin: {
        label: msg("fields.reverseSpin", "Reverse Spin Direction"),
        type: "radio",
        options: [
          { label: msg("fields.yes", "Yes"), value: true },
          { label: msg("fields.no", "No"), value: false },
        ],
      },
      addFork: {
        label: msg("fields.addFork", "Add Fork"),
        type: "number",
        min: 0,
        step: 1,
      },
      items: {
        label: msg("fields.items", "Items"),
        ...offeringsItemSource.field,
      },
    },
  },
};

const UpscaleRestaurantCss = `
.fb-offerings-shell {
  font-family: var(--fontFamily-body-fontFamily);
  font-size: var(--fontSize-body-fontSize);
  font-weight: var(--fontWeight-body-fontWeight);
  line-height: 1.5;
}
.fb-offerings-shell * { box-sizing: border-box; }
.fb-offerings-shell p,
.fb-offerings-shell li {
  font-family: var(--fontFamily-body-fontFamily);
  font-size: var(--fontSize-body-fontSize);
  line-height: 1.5;
  font-weight: var(--fontWeight-body-fontWeight);
  font-style: var(--fontStyle-body-fontStyle);
  text-transform: var(--textTransform-body-textTransform);
}
.fb-offerings-shell h1 {
  font-family: var(--fontFamily-h1-fontFamily);
  font-size: var(--fontSize-h1-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h1-fontWeight);
  font-style: var(--fontStyle-h1-fontStyle);
  text-transform: var(--textTransform-h1-textTransform);
}
.fb-offerings-shell h2 {
  font-family: var(--fontFamily-h2-fontFamily);
  font-size: var(--fontSize-h2-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h2-fontWeight);
  font-style: var(--fontStyle-h2-fontStyle);
  text-transform: var(--textTransform-h3-textTransform);
}
.fb-offerings-shell h3 {
  font-family: var(--fontFamily-h3-fontFamily);
  font-size: var(--fontSize-h3-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h3-fontWeight);
  font-style: var(--fontStyle-h3-fontStyle);
  text-transform: var(--textTransform-h3-textTransform);
}
.fb-offerings-shell h4 {
  font-family: var(--fontFamily-h4-fontFamily);
  font-size: var(--fontSize-h4-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h4-fontWeight);
  font-style: var(--fontStyle-h4-fontStyle);
  text-transform: var(--textTransform-h4-textTransform);
}
.fb-offerings-shell h5 {
  font-family: var(--fontFamily-h5-fontFamily);
  font-size: var(--fontSize-h5-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h5-fontWeight);
  font-style: var(--fontStyle-h5-fontStyle);
  text-transform: var(--textTransform-h5-textTransform);
}
.fb-offerings-shell h6 {
  font-family: var(--fontFamily-h6-fontFamily);
  font-size: var(--fontSize-h6-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h6-fontWeight);
  font-style: var(--fontStyle-h6-fontStyle);
  text-transform: var(--textTransform-h6-textTransform);
}
.fb-section {
  padding-block: var(--padding-pageSection-verticalPadding);
}
.fb-tint-section {
  background: var(--fb-tint-bg);
}
.fb-container {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
}
.fb-offerings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 72px;
}
.fb-offerings-cutlery {
  position: relative;
  width: 100%;
  height: clamp(320px, 38vw, 480px);
  perspective: 900px;
  overflow: hidden;
}
.fb-offerings-cutlery::after {
  content: "";
  position: absolute;
  bottom: 8%;
  left: 20%;
  width: 60%;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.18), transparent 70%);
  filter: blur(8px);
}
.fb-cutlery-orbit {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  animation: fb-cutlery-orbit 14s linear infinite;
}
.fb-cutlery-utensil {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 64px;
  height: 280px;
  margin: -140px 0 0 -32px;
  transform-style: preserve-3d;
}
.fb-cutlery-utensil {
  transform: rotateY(var(--fb-cutlery-angle)) translateX(-100px) rotateY(calc(-1 * var(--fb-cutlery-angle))) rotateZ(var(--fb-cutlery-tilt, 0deg));
}
.fb-cutlery-knife { --fb-cutlery-tilt: -18deg; }
.fb-cutlery-spoon { --fb-cutlery-tilt: 18deg; }
.fb-cutlery-fork .fb-cutlery-head {
  left: 7px;
  width: 50px;
  height: 128px;
  clip-path: polygon(0 0, 14% 0, 18% 48%, 27% 48%, 29% 0, 43% 0, 45% 48%, 55% 48%, 57% 0, 71% 0, 73% 48%, 82% 48%, 86% 0, 100% 0, 96% 60%, 70% 82%, 70% 100%, 30% 100%, 30% 82%, 4% 60%);
}
.fb-cutlery-handle,
.fb-cutlery-head {
  position: absolute;
  background: linear-gradient(90deg, #626970 0%, #c6ccd1 18%, #f8fafb 40%, #a0a8b0 62%, #eef1f3 78%, #646c74 100%);
  border: 1px solid #8b939b;
  box-shadow: inset 2px 0 3px rgba(255, 255, 255, 0.7), inset -2px 0 3px rgba(0, 0, 0, 0.2);
}
.fb-cutlery-handle {
  bottom: 0;
  left: 22px;
  width: 20px;
  height: 180px;
  border-radius: 45% 45% 9px 9px;
}
.fb-cutlery-head { top: 0; }
.fb-cutlery-knife .fb-cutlery-head {
  left: 22px;
  width: 34px;
  height: 128px;
  border-radius: 4px 90% 16% 4px;
}
.fb-cutlery-spoon .fb-cutlery-head {
  left: 0;
  width: 64px;
  height: 94px;
  border-radius: 50% 50% 46% 46%;
  background: radial-gradient(ellipse at 58% 38%, #dbe0e4 0%, #939da6 35%, #eef1f3 61%, #7c858e 78%, #c6ccd1 100%);
}
.fb-cutlery-handle::after,
.fb-cutlery-head::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: inherit;
  border: inherit;
  transform: translateZ(-4px);
  box-shadow: 2px 1px 0 #727b83;
}
@keyframes fb-cutlery-orbit {
  from { transform: rotateX(-12deg) rotateY(0deg); }
  to { transform: rotateX(-12deg) rotateY(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .fb-cutlery-orbit {
    animation: none;
    transform: rotateX(-12deg) rotateY(-25deg);
  }
}
.fb-offerings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.fb-offerings-list li {
  position: relative;
  margin-bottom: 12px;
  padding-left: 24px;
  color: var(--fb-text);
}
.fb-offerings-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--fb-list-bullet);
}
.fb-offerings-list .fb-unavailable::before {
  content: "×";
  color: var(--fb-list-unavailable);
}
@media (max-width: 1100px) {
  .fb-offerings-grid {
    gap: 24px;
  }
}
@media (max-width: 760px) {
  .fb-section {
    padding-block: 72px;
  }
  .fb-offerings-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .fb-offerings-cutlery { height: 320px; }
}
`;

const OfferingsSection: PuckComponent<OfferingsSectionProps> = (props) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const heading = resolveComponentData(
    props.offerings.heading.text,
    locale,
    streamDocument,
  );
  const sectionSurfaceStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
  );
  const headingColor = getThemeColorCssValue(props.offerings.heading.fontColor);
  const headingStyle: React.CSSProperties = {
    ...getTextStyle(
      props.offerings.heading.styles,
      props.offerings.heading.fontColor,
    ),
    margin: "0 0 32px",
    color: headingColor,
  };
  const resolvedItems = offeringsItemSource.resolveItems(
    props.offerings.items,
    streamDocument,
  );
  const requestedForks = Number(props.offerings.addFork);
  const forkCount = Number.isFinite(requestedForks) ? Math.max(0, Math.floor(requestedForks)) : 0;
  const utensils = ["knife", "spoon", ...Array.from({ length: forkCount }, () => "fork")];
  const pageStyle: OfferingsStyle = {
    ...sectionSurfaceStyle,
    "--fb-list-bullet": "currentColor",
    "--fb-list-unavailable": "currentColor",
  };

  return (
    <VisibilityWrapper
      liveVisibility={props.section.visibleOnLivePage}
      isEditing={props.puck?.isEditing ?? false}
    >
      <Background
        className="fb-offerings-shell"
        background={props.section.backgroundColor}
        style={pageStyle}
      >
        <style>{UpscaleRestaurantCss}</style>
        <section className="fb-section fb-tint-section">
          <div className="fb-container fb-offerings-grid">
            <div className="fb-offerings-cutlery" aria-hidden="true">
              <div className="fb-cutlery-orbit" style={{ animationDirection: props.offerings.reverseSpin ? "reverse" : "normal" }}>
                {utensils.map((utensil, index) => {
                  const style: OfferingsStyle = { "--fb-cutlery-angle": `${index * 360 / utensils.length}deg` };
                  return (
                    <div key={`${utensil}-${index}`} className={`fb-cutlery-utensil fb-cutlery-${utensil}`} style={style}>
                      <div className="fb-cutlery-handle" />
                      <div className="fb-cutlery-head" />
                    </div>
                  );
                })}
              </div>
            </div>
            <article>
              <EntityField
                displayName={pt("heading", "Heading")}
                fieldId={props.offerings.heading.text.field}
                constantValueEnabled={
                  props.offerings.heading.text.constantValueEnabled
                }
              >
                <h2 style={headingStyle}>{heading}</h2>
              </EntityField>
              <EntityField
                displayName={pt("items", "Items")}
                fieldId={props.offerings.items.field}
                constantValueEnabled={
                  props.offerings.items.constantValueEnabled
                }
              >
                <ul className="fb-offerings-list">
                  {resolvedItems.map((item, index) => {
                    const itemLabelValue = item.label ?? "";
                    const resolvedItemLabel = resolveComponentData(
                      itemLabelValue,
                      locale,
                      streamDocument,
                    );

                    return (
                      <li
                        key={`${resolvedItemLabel || "item"}-${index}`}
                        className={
                          item.unavailable ? "fb-unavailable" : undefined
                        }
                        style={item.unavailable ? { opacity: 0.65 } : undefined}
                      >
                        {resolvedItemLabel}
                      </li>
                    );
                  })}
                </ul>
              </EntityField>
            </article>
          </div>
        </section>
      </Background>
    </VisibilityWrapper>
  );
};

export const UpscaleRestaurantOfferingsSection: YextComponentConfig<OfferingsSectionProps> =
  {
    label: msg("components.offeringsSection", "Offerings Section"),
    fields: offeringsFields,
    defaultProps,
    render: OfferingsSection,
  };

export const config: SectionConfig = {
  id: "UpscaleRestaurantOfferingsSection",
  displayName: "Offerings Section",
  description: "Offerings Section",
  pageSetTypes: ["ENTITY"],
};
