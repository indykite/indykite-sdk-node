import { v4 } from 'uuid';
import { DigitalTwin } from '../digitaltwin';
import { Property } from '../property';

describe('properties', () => {
  let dt: DigitalTwin;
  const emailId = v4();

  beforeEach(() => {
    dt = new DigitalTwin(v4(), v4(), 1, 1);
    const email = new Property('email', emailId)
      .withMetadata(false)
      .withValue('test+email@indykite.com');
    dt.addProperty(email);
  });

  it('delete property', () => {
    dt.deleteProperty(new Property('email', emailId));
    expect(dt.getProperty('email')).toBeUndefined();
    expect(dt.getPatchOperation()).toHaveLength(2);
    dt.deleteProperty(new Property('email', emailId));
    expect(dt.getProperty('email')).toBeUndefined();
    expect(dt.getPatchOperation()).toHaveLength(2);
    dt.deleteProperty(new Property('email-notexisting', emailId));
    expect(dt.getProperty('email-notexisting')).toBeUndefined();
    expect(dt.getPatchOperation()).toHaveLength(2);
  });

  it('update property', () => {
    const emailAddress = 'no+email@indykite.com';
    const email = new Property('email', emailId)
      .withMetadata(true)
      .withValue('test+newemail@indykite.com');
    dt.updateProperty(email); //2

    const newEmail = dt.getProperty('email');
    expect(newEmail).not.toBeUndefined();
    expect(newEmail?.value).toEqual('test+newemail@indykite.com');
    expect(newEmail?.isPrimary).toBeTruthy();

    dt.updateProperty(new Property('email-notexisting', emailId).withValue(emailAddress)); //still 2
    expect(dt.getProperty('email-notexisting')).toBeUndefined();
    expect(dt.getPatchOperation()).toHaveLength(2);

    dt.updateProperty(new Property('email', v4()).withValue(emailAddress)); //still 2
    expect(dt.getProperty('email')?.value).toEqual('test+newemail@indykite.com');
    expect(dt.getPatchOperation()).toHaveLength(2);
  });

  it('update value', () => {
    const emailAddress = 'test+new@indykite.com';
    const email = dt.getProperty('email') as Property;
    dt.updatePropertyValue(email, emailAddress); //2
    expect(dt.getPropertyValue('email')).toEqual(emailAddress);
    expect(dt.getPatchOperation()).toHaveLength(2);

    dt.updatePropertyValue(new Property('email-notexisting', emailId), emailAddress); //still 2
    expect(dt.getProperty('email-notexisting')).toBeUndefined();
    expect(dt.getPatchOperation()).toHaveLength(2);

    dt.updatePropertyValue(new Property('email', v4()), emailAddress); //still 2
    expect(dt.getProperty('email')?.value).toEqual(emailAddress);
    expect(dt.getPatchOperation()).toHaveLength(2);
  });

  it('update metadata', () => {
    const email = dt.getProperty('email') as Property;
    dt.updatePropertyMetadata(email, true); //2
    const metadata = (dt.getProperty('email') as Property).meta;
    expect(dt.getPatchOperation()).toHaveLength(2);
    expect(metadata?.primary).toBeTruthy();

    dt.updatePropertyMetadata(new Property('email-notexisting', emailId), false); //still 2
    expect(dt.getProperty('email-notexisting')).toBeUndefined();
    expect(dt.getPatchOperation()).toHaveLength(2);

    dt.updatePropertyMetadata(new Property('email', v4()), false);
    expect(dt.getProperty('email')?.value).toEqual(email.value);
    expect(dt.getPatchOperation()).toHaveLength(2);
  });

  it('conditional values', () => {
    expect(dt.getPropertyValue('email')).toEqual('test+email@indykite.com');
    expect(dt.getPropertyValue('firstName')).toBeUndefined();
    expect(dt.getProperties('email')).toHaveLength(1);
    expect(dt.getProperties('firstName')).toHaveLength(0);
  });

  describe('when a property is required by id', () => {
    const mobile1Id = v4();
    const mobile2Id = v4();
    const mobile1Value = '+421949949949';
    const mobile2Value = '+421905505505';

    beforeEach(() => {
      const mobile1 = new Property('mobile', mobile1Id).withMetadata(false).withValue(mobile1Value);
      const mobile2 = new Property('mobile', mobile2Id).withMetadata(false).withValue(mobile2Value);
      dt.addProperty(mobile1);
      dt.addProperty(mobile2);
    });

    describe('when a property exists', () => {
      let property: Property | undefined;

      beforeEach(() => {
        property = dt.getPropertyById(mobile2Id);
      });

      it('returns correct property', () => {
        expect(property?.value).toBe(mobile2Value);
      });
    });

    describe('when a property does not exist', () => {
      let property: Property | undefined;

      beforeEach(() => {
        property = dt.getPropertyById(v4());
      });

      it('returns no property', () => {
        expect(property).toBeUndefined();
      });
    });
  });
});
