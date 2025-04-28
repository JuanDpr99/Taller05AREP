package co.edu.eci.arep.WebApplication;

import co.edu.eci.arep.WebApplication.model.Property;
import co.edu.eci.arep.WebApplication.repository.PropertyRepository;
import co.edu.eci.arep.WebApplication.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
@SpringBootTest
class WebApplicationTests {

	@Mock
	private PropertyRepository propertyRepository;

	@InjectMocks
	private PropertyService propertyService;

	private Property property;

	@BeforeEach
	void setUp() {
		property = new Property();
		property.setId(1L);
		property.setAddress("123 Main St");
		property.setPrice(250000);
		property.setSize(1200);
		property.setDescription("Beautiful home");
	}

	@Test
	void testCreateProperty() {
		when(propertyRepository.save(any(Property.class))).thenReturn(property);

		Property createdProperty = propertyService.createProperty(property);

		assertNotNull(createdProperty);
		assertEquals("123 Main St", createdProperty.getAddress());
		assertEquals(Optional.of(250000), Optional.ofNullable(createdProperty.getPrice()));
		verify(propertyRepository, times(1)).save(property);
	}

	@Test
	void testGetPropertyById_Found() {
		when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));

		Property foundProperty = propertyService.getPropertyById(1L);

		assertNotNull(foundProperty);
		assertEquals(Optional.of(1L), Optional.ofNullable(foundProperty.getPropertyId()));
		verify(propertyRepository, times(1)).findById(1L);
	}

	@Test
	void testGetPropertyById_NotFound() {
		when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

		Exception exception = assertThrows(ResponseStatusException.class, () -> propertyService.getPropertyById(1L));

		assertTrue(exception.getMessage().contains("Property not found"));
		verify(propertyRepository, times(1)).findById(1L);
	}

	@Test
	void testUpdateProperty_Success() {
		Property updatedDetails = new Property();
		updatedDetails.setId(1L);
		updatedDetails.setAddress("456 Elm St");
		updatedDetails.setPrice(300000);
		updatedDetails.setSize(1500);
		updatedDetails.setDescription("Upgraded home");

		when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));
		when(propertyRepository.save(any(Property.class))).thenReturn(updatedDetails);

		Property updatedProperty = propertyService.updateProperty(1L, updatedDetails);

		assertEquals("456 Elm St", updatedProperty.getAddress());
		assertEquals(Optional.of(300000), Optional.of(updatedProperty.getPrice()));
		verify(propertyRepository, times(1)).save(property);
	}

	@Test
	void testUpdateProperty_NotFound() {
		when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

		Exception exception = assertThrows(ResponseStatusException.class, () -> propertyService.updateProperty(1L, property));

		assertTrue(exception.getMessage().contains("Property not found"));
		verify(propertyRepository, times(1)).findById(1L);
	}

	@Test
	void testDeleteProperty_Success() {
		when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));
		doNothing().when(propertyRepository).delete(property);

		assertDoesNotThrow(() -> propertyService.deleteProperty(1L));

		verify(propertyRepository, times(1)).delete(property);
	}

	@Test
	void testDeleteProperty_NotFound() {
		when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

		Exception exception = assertThrows(ResponseStatusException.class, () -> propertyService.deleteProperty(1L));

		assertTrue(exception.getMessage().contains("Property not found"));
		verify(propertyRepository, times(1)).findById(1L);
	}

}
